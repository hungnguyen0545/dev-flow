"use server";

import mongoose from "mongoose";

import Answer from "@/databases/answer.model";
import Question from "@/databases/question.model";

import { action } from "../handlers/action";
import handleError from "../handlers/errors";
import { CreateAnswerSchema } from "../validations";

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
