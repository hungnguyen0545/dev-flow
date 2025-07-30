import mongoose from "mongoose";
import { NextResponse } from "next/server";
import slugify from "slugify";

import { RESPONSE_SOURCE } from "@/constants";
import { Account, User } from "@/databases";
import handleError from "@/lib/handlers/errors";
import { ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { SignInWithOAuthSchema } from "@/lib/validations";

export const POST = async (req: Request) => {
  const { provider, providerAccountId, user } = await req.json();

  await dbConnect();

  /**
   * Start transaction to ensure data consistency
   * if any error occurs, transaction will be rolled back
   * and session will be ended to release resources
   */
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const validatedData = SignInWithOAuthSchema.safeParse({
      provider,
      providerAccountId,
      user,
    });

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const { name, username, email, image } = user;
    const slugifiedUsername = slugify(username, {
      lower: true,
      strict: true,
      trim: true,
    });
    let existingUser = await User.findOne({ email }).session(session); // use session to ensure data consistency

    if (!existingUser) {
      [existingUser] = await User.create(
        [
          {
            name,
            username: slugifiedUsername,
            email,
            image,
            reputation: 0,
          },
        ],
        { session }
      );
    } else {
      const updatedUser: { name?: string; image?: string } = {};

      if (existingUser.username !== name) {
        updatedUser.name = name;
      }

      if (existingUser.image !== image) {
        updatedUser.image = image;
      }

      if (Object.keys(updatedUser).length > 0) {
        await existingUser
          .updateOne({ _id: existingUser._id }, { $set: updatedUser })
          .session(session);
      }
    }

    const existingAccount = await Account.findOne({
      userId: existingUser._id,
      provider,
      providerAccountId,
    }).session(session);

    if (!existingAccount) {
      await Account.create(
        [
          {
            userId: existingUser._id,
            name,
            image,
            provider,
            providerAccountId,
          },
        ],
        { session }
      );
    }

    // commit transaction to save changes
    await session.commitTransaction();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    // rollback transaction on error
    await session.abortTransaction();
    return handleError(error, RESPONSE_SOURCE.API) as APIResponse;
  } finally {
    // end session to release resources
    await session.endSession();
  }
};
