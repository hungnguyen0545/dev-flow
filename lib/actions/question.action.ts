"use server";

import mongoose, { FilterQuery } from "mongoose";

import { Question, Tag, TagQuestion } from "@/databases";
import { ITagDoc } from "@/databases/tag.model";

import { action } from "../handlers/action";
import handleError from "../handlers/errors";
import { ForbiddenError, NotFoundError } from "../http-errors";
import { convertToJson } from "../utils";
import {
  AskQuestionSchema,
  EditQuestionSchema,
  GetQuestionSchema,
  PaginatedSearchParamsSchema,
} from "../validations";

export const getQuestion = async ({
  params,
}: {
  params: { questionId: string };
}) => {
  const validationResult = await action({
    params,
    schema: GetQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;

  try {
    const question = await Question.findById(questionId)
      .populate("tags")
      .populate("author", "name image");

    if (!question) {
      throw new Error("Question not found");
    }

    return { success: true, data: convertToJson(question) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const getQuestions = async (
  params: PaginatedSearchParams
): Promise<ActionResponse<{ questions: Question[]; isNext: boolean }>> => {
  const validatedResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
    authorize: true,
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query, filter } = validatedResult.params!;
  const skip = (Number(page) - 1) * Number(pageSize); // skip the first n questions
  const limit = Number(pageSize); // limit the number of questions returned

  const filterQuery: FilterQuery<Question> = {};

  if (filter === "recommended") {
    return {
      success: true,
      data: { questions: [], isNext: false },
    };
  }

  if (query) {
    filterQuery.$or = [
      { title: { $regex: query, $options: "i" } }, // case insensitive regex. Ex: "react" will match "React"
      { content: { $regex: query, $options: "i" } },
    ];
  }

  let sortCriteria = {};

  switch (filter) {
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;
    case "unanswered":
      filterQuery.answers = 0;
      sortCriteria = { createdAt: -1 };
      break;
    case "popular":
      sortCriteria = { upvotes: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const questions = await Question.find(filterQuery)
      .populate("tags", "name")
      .populate("authorId", "name image")
      .skip(skip)
      .sort(sortCriteria)
      .limit(limit);

    const totalQuestions = await Question.countDocuments(filterQuery);
    const isNext = skip + limit < totalQuestions;

    const transformedQuestions = convertToJson(questions);
    transformedQuestions.forEach((question: Record<string, unknown>) => {
      question.author = question.authorId;
      delete question.authorId;
    });

    return {
      success: true,
      data: { questions: transformedQuestions, isNext },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

/**
 * Creates a new question with associated tags in the database
 * @param params - Object containing title, content, and tags for the new question
 * @returns Promise resolving to ActionResponse containing created Question or error
 *
 * This function:
 * 1. Validates the input parameters and user authorization
 * 2. Starts a MongoDB transaction
 * 3. Creates a new question with the provided title and content
 *
 * Tag Management:
 * 4. For each tag provided:
 *    - Finds or creates the tag in Tag collection (case-insensitive)
 *    - Increments the tag's question count
 *    - Creates link between tag and question (TagQuestion)
 *
 * 5. Updates the question with final list of tag IDs
 *
 * All changes are handled in a transaction to maintain data consistency
 */
export const createQuestion = async ({
  params,
}: {
  params: CreateQuestionParams;
}): Promise<ActionResponse<Question>> => {
  const validatedResult = await action({
    params,
    schema: AskQuestionSchema,
    authorize: true,
  });
  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { title, content, tags } = validatedResult.params!;
    const userId = validatedResult.session?.user?.id;

    // Create question
    const [question] = await Question.create(
      [
        {
          title,
          content,
          authorId: userId,
        },
      ],
      { session }
    );
    if (!question) {
      throw new Error("Failed to create question");
    }

    // update tags list
    const tagIds: mongoose.Types.ObjectId[] = [];
    const tagQuestionDocuments = [];
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } }, // case insensitive regex
        { $setOnInsert: { name: tag }, $inc: { questions: 1 } }, // set the name if not found, increment questions count
        { upsert: true, new: true, session } // upsert if not found, return the new tag, and use the session
      );

      tagIds.push(existingTag._id);
      tagQuestionDocuments.push({
        tagId: existingTag._id,
        questionId: question._id,
      });
    }

    // update question tags
    await TagQuestion.insertMany(tagQuestionDocuments, { session });

    // update question tags
    await Question.findByIdAndUpdate(
      question._id,
      { $push: { tags: { $each: tagIds } } }, // push the tag ids to the question tags array
      { session }
    );

    await session.commitTransaction();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)), // convert the question to a JSON object
      status: 201,
    };
  } catch (error) {
    // Only abort if the transaction hasn't been committed yet
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
};

/**
 * Edit an existing question with updated title, content, and tags
 * @param params - Object containing questionId, title, content, and tags
 * @returns Promise resolving to ActionResponse containing edited Question or error
 *
 * This function:
 * 1. Validates the input parameters and user authorization
 * 2. Starts a MongoDB transaction
 * 3. Finds and verifies the question exists and user has permission
 * 4. Updates question title and content if changed
 *
 * Tag Management:
 * 5. For new tags added to the question:
 *    - Creates or finds existing tag in Tag collection
 *    - Increments tag's question count
 *    - Creates link between tag and question (TagQuestion)
 *
 * 6. For tags removed from the question:
 *    - Removes tag-question link
 *    - Decrements tag's question count
 *
 * 7. Updates question with final list of tags
 *
 * All changes are handled in a transaction to maintain data consistency
 */
export const editQuestion = async ({
  params,
}: {
  params: EditQuestionParams;
}): Promise<ActionResponse<Question>> => {
  const validatedResult = await action({
    params,
    schema: EditQuestionSchema,
    authorize: true,
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { questionId, title, content, tags } = validatedResult.params!;
    const userId = validatedResult.session?.user?.id;

    const question = await Question.findById(questionId).populate("tags");
    if (!question) {
      throw new NotFoundError("Question");
    }

    if (question.authorId.toString() !== userId) {
      throw new ForbiddenError("You are not authorized to edit this question");
    }

    if (question.title !== title) {
      question.title = title;
    }

    if (question.content !== content) {
      question.content = content;
    }

    const newTagQuestionDocuments = [];

    const tagsToAdd = tags.filter(
      (tag) =>
        !question.tags.some(
          (t: ITagDoc) => t.name.toLowerCase().includes(tag.toLowerCase()) // check if the tag is already in the question tags
        )
    );

    if (tagsToAdd.length > 0) {
      for (const tag of tagsToAdd) {
        const existingTag = await Tag.findOneAndUpdate(
          { name: { $regex: `^${tag}$`, $options: "i" } },
          { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
          { upsert: true, new: true, session }
        );

        if (existingTag) {
          question.tags.push(existingTag._id);

          newTagQuestionDocuments.push({
            tagId: existingTag._id,
            questionId: question._id,
          });
        }
      }
    }

    const tagsToRemove = question.tags.filter(
      (tag: ITagDoc) =>
        !tags.some(
          (t: string) => t.toLowerCase() === tag.name.toLowerCase() // check if the tag is already in the new tags
        )
    );
    if (tagsToRemove.length > 0) {
      const tagIdsToRemove = tagsToRemove.map((tag: ITagDoc) => tag._id);

      await TagQuestion.updateMany(
        { _id: { $in: tagIdsToRemove } },
        { $inc: { questions: -1 } },
        { session }
      );

      await TagQuestion.deleteMany(
        { questionId, tagId: { $in: tagIdsToRemove } },
        { session }
      );

      question.tags = question.tags.filter(
        (tag: mongoose.Types.ObjectId) =>
          !tagIdsToRemove.some((id: mongoose.Types.ObjectId) =>
            id.equals(tag._id)
          )
      );
    }

    if (newTagQuestionDocuments.length > 0) {
      await TagQuestion.insertMany(newTagQuestionDocuments, { session });
    }

    await question.save({ session });
    await session.commitTransaction();

    return {
      success: true,
      data: convertToJson(question),
      status: 200,
    };
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
};
