import { NextResponse } from "next/server";

import { RESPONSE_SOURCE } from "@/constants";
import { User } from "@/databases";
import handleError from "@/lib/handlers/errors";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";

// GET /api/users/[id]
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    throw new NotFoundError("User");
  }

  try {
    await dbConnect();

    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError("User");
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return handleError(error, RESPONSE_SOURCE.API) as APIResponse;
  }
}

// PUT /api/users/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    throw new NotFoundError("User");
  }

  try {
    await dbConnect();

    // Validate the request body
    const body = await request.json();
    const validatedBody = UserSchema.partial().safeParse(body);
    if (!validatedBody.success) {
      throw new ValidationError(validatedBody.error.flatten().fieldErrors);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: validatedBody.data },
      { new: true }
    );

    if (!updatedUser) {
      throw new NotFoundError("User");
    }

    return NextResponse.json(
      { success: true, data: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, RESPONSE_SOURCE.API) as APIResponse;
  }
}

// DELETE /api/users/[id]
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    throw new NotFoundError("User");
  }

  try {
    await dbConnect();

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new NotFoundError("User");
    }

    return NextResponse.json(
      { success: true, data: deletedUser },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, RESPONSE_SOURCE.API) as APIResponse;
  }
}
