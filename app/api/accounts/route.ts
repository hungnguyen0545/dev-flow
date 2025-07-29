import { NextResponse } from "next/server";

import { RESPONSE_SOURCE } from "@/constants";
import Account from "@/databases/account.model";
import handleError from "@/lib/handlers/errors";
import { ForbiddenError, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validations";

export async function GET() {
  try {
    await dbConnect();

    const accounts = await Account.find();
    return NextResponse.json(
      { success: true, data: accounts },
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
    const validatedAccount = AccountSchema.safeParse(body);
    if (!validatedAccount.success) {
      throw new ValidationError(validatedAccount.error.flatten().fieldErrors);
    }

    const { provider, providerAccountId } = validatedAccount.data;
    const existingAccount = await Account.findOne({
      provider,
      providerAccountId,
    });

    if (existingAccount) {
      throw new ForbiddenError(
        "An account with the same provider already exists"
      );
    }

    // TODO: Consider?: add a check to see if the user exists

    const newAccount = await Account.create(validatedAccount.data);
    return NextResponse.json(
      { success: true, data: newAccount },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, RESPONSE_SOURCE.API) as APIResponse;
  }
}
