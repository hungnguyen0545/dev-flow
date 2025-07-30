import { NextResponse } from "next/server";

import { RESPONSE_SOURCE } from "@/constants";
import { Account } from "@/databases";
import handleError from "@/lib/handlers/errors";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validations";

// GET /api/accounts/[id]
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    throw new NotFoundError("Account");
  }

  try {
    await dbConnect();

    const account = await Account.findById(id);
    if (!account) {
      throw new NotFoundError("Account");
    }

    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    return handleError(error, RESPONSE_SOURCE.API) as APIResponse;
  }
}

// PUT /api/accounts/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    throw new NotFoundError("Account");
  }

  try {
    await dbConnect();

    // Validate the request body
    const body = await request.json();
    const validatedBody = AccountSchema.partial().safeParse(body);
    if (!validatedBody.success) {
      throw new ValidationError(validatedBody.error.flatten().fieldErrors);
    }

    const updatedAccount = await Account.findByIdAndUpdate(
      id,
      { $set: validatedBody.data },
      { new: true }
    );

    if (!updatedAccount) {
      throw new NotFoundError("Account");
    }

    return NextResponse.json(
      { success: true, data: updatedAccount },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, RESPONSE_SOURCE.API) as APIResponse;
  }
}

// DELETE /api/accounts/[id]
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    throw new NotFoundError("Account");
  }

  try {
    await dbConnect();

    const deletedAccount = await Account.findByIdAndDelete(id);
    if (!deletedAccount) {
      throw new NotFoundError("Account");
    }

    return NextResponse.json(
      { success: true, data: deletedAccount },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, RESPONSE_SOURCE.API) as APIResponse;
  }
}
