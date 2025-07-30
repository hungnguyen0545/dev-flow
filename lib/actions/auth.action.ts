"use server";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { signIn } from "@/auth";
import Account from "@/databases/account.model";
import User from "@/databases/user.model";
import { action } from "@/lib/handlers/action";

import handleError from "../handlers/errors";
import { NotFoundError } from "../http-errors";
import logger from "../logger";
import { SignInSchema, SignUpSchema } from "../validations";

export const signUpWithCredentials = async ({
  params,
}: {
  params: AuthCredentials;
}): Promise<ActionResponse> => {
  const validatedResult = await action({ params, schema: SignUpSchema });
  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }
  const { name, username, email, password } = validatedResult.params!;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingUser = await User.findOne({ username }).session(session);

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [newUser] = await User.create(
      [
        {
          name,
          username,
          email,
        },
      ],
      { session }
    );

    await Account.create(
      [
        {
          userId: newUser._id,
          name,
          password: hashedPassword,
          provider: "credentials",
          providerAccountId: email,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    // Move signIn outside the transaction block
    try {
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
    } catch (signInError) {
      logger.error("Sign in error:", signInError);
      // Don't throw here, just log the error
      // The user is still created successfully
    }

    return {
      success: true,
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

export const signInWithCredentials = async ({
  params,
}: {
  params: Pick<AuthCredentials, "email" | "password">;
}): Promise<ActionResponse> => {
  const validatedResult = await action({ params, schema: SignInSchema });
  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  const { email, password } = validatedResult.params!;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new NotFoundError("User not found");
    }

    const existingAccount = await Account.findOne({
      provider: "credentials",
      providerAccountId: email,
    });
    if (!existingAccount) {
      throw new NotFoundError("Account not found");
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingAccount.password
    );
    if (!isPasswordCorrect) {
      throw new Error("Invalid password");
    }

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return {
      success: true,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
