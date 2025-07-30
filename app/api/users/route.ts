import { NextResponse } from "next/server";

import { RESPONSE_SOURCE } from "@/constants";
import { User } from "@/databases";
import handleError from "@/lib/handlers/errors";
import { ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find();

    return NextResponse.json(
      {
        success: true,
        data: users,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, RESPONSE_SOURCE.API) as APIResponse;
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Validate the request body
    const validatedBody = UserSchema.safeParse(body);

    if (!validatedBody.success) {
      throw new ValidationError(validatedBody.error.flatten().fieldErrors);
    }

    const { email, username } = validatedBody.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      throw new Error("Username already exists");
    }

    const newUser = await User.create(validatedBody.data);

    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error) {
    return handleError(error, RESPONSE_SOURCE.API) as APIResponse;
  }
}
