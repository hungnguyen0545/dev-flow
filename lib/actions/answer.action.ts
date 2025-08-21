"use server";

import mongoose from "mongoose";

import Answer from "@/databases/answer.model";
import Question from "@/databases/question.model";

import { action } from "../handlers/action";
import handleError from "../handlers/errors";
import { CreateAnswerSchema, GetAnswersSchema } from "../validations";

export const getAnswers = async (
  params: GetAnswersParams
): Promise<
  ActionResponse<{
    answers: Answer[];
    totalAnswers: number;
    isNext: boolean;
  }>
> => {
  const validatedResult = await action({
    params,
    schema: GetAnswersSchema,
    authorize: true,
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  try {
    const {
      questionId,
      page = 1,
      pageSize = 10,
      filter,
    } = validatedResult.params!;

    const skip = (Number(page) - 1) * Number(pageSize);
    const limit = Number(pageSize);

    let sortCriteria = {};

    switch (filter) {
      case "latest":
        sortCriteria = { createdAt: -1 };
        break;
      case "oldest":
        sortCriteria = { createdAt: 1 };
        break;
      case "popular":
        sortCriteria = { upvotes: -1 };
        break;
      default:
        sortCriteria = { createdAt: -1 };
        break;
    }

    const totalAnswers = await Answer.countDocuments({
      questionId,
    });

    const answers = await Answer.find({
      questionId,
    })
      .populate("authorId", "_id name image")
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = skip + answers.length < totalAnswers;

    let transformedAnswers = JSON.parse(JSON.stringify(answers));
    transformedAnswers = transformedAnswers.map(
      (answer: Record<string, unknown>) => {
        answer.author = answer.authorId;
        delete answer.authorId;

        return answer;
      }
    );

    return {
      success: true,
      data: {
        answers: transformedAnswers,
        totalAnswers,
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const createAnswer = async (
  params: CreateAnswerParams
): Promise<ActionResponse<Answer>> => {
  const validatedResult = await action({
    params,
    schema: CreateAnswerSchema,
    authorize: true,
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  const { questionId, content } = validatedResult.params!;
  const userId = validatedResult.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // check if question exists and get the questionId
    const question = await Question.findById(questionId);
    if (!question) {
      throw new Error("Question not found");
    }

    const [newAnswer] = await Answer.create(
      [
        {
          questionId,
          authorId: userId,
          content,
        },
      ],
      { session }
    );

    if (!newAnswer) {
      throw new Error("Failed to create answer");
    }

    question.answers++;
    await question.save({ session });

    await session.commitTransaction();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newAnswer)),
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
};
