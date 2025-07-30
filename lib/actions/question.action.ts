"use server";

import mongoose from "mongoose";

import { Question, Tag, TagQuestion } from "@/databases";

import { action } from "../handlers/action";
import handleError from "../handlers/errors";
import { AskQuestionSchema } from "../validations";

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
