"use server";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { signIn } from "@/auth";
import Account from "@/databases/account.model";
import User from "@/databases/user.model";
import { action } from "@/lib/handlers/action";

import handleError from "../handlers/errors";
import { SignUpSchema } from "../validations";

export const signUpWithCredentials = async ({
  params,
}: {
  params: AuthCredentials;
}): Promise<ActionResponse> => {
  console.log("params", params);
  const validatedResult = await action({ params, schema: SignUpSchema });
  console.log("validatedResult", validatedResult);
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
      console.error("Sign in error:", signInError);
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
