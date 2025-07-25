import { NextResponse } from "next/server";

import { RESPONSE_SOURCE } from "@/constants";
import User from "@/databases/user.model";
import handleError from "@/lib/handlers/errors";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";

/**
 *  POST /api/users/email
 *
 *  - Purpose: To allow authentication checks by email only.
 *  - Reason: use POST for "get user by email" to protect sensitive information,
 *    allow for better input validation, and avoid caching or logging issues that could expose user data.
 **/

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const validatedEmail = UserSchema.partial().safeParse(body);
    if (!validatedEmail.success) {
      throw new ValidationError(validatedEmail.error.flatten().fieldErrors);
    }

    const { email } = validatedEmail.data;

    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFoundError("User");
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return handleError(error, RESPONSE_SOURCE.API) as APIResponse;
  }
}
