import { NextResponse } from "next/server";

import { RESPONSE_SOURCE } from "@/constants";
import Account from "@/databases/account.model";
import handleError from "@/lib/handlers/errors";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validations";

/**
 *  POST /api/accounts/provider
 *
 *  - Purpose: To allow authentication checks by provider only.
 *  - Reason: use POST for "get account by provider" to protect sensitive information,
 *    allow for better input validation, and avoid caching or logging issues that could expose account data.
 **/

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const validatedProvider = AccountSchema.partial().safeParse(body);
    if (!validatedProvider.success) {
      throw new ValidationError(validatedProvider.error.flatten().fieldErrors);
    }

    const { providerAccountId } = validatedProvider.data;

    const account = await Account.findOne({
      providerAccountId,
    });

    if (!account) {
      throw new NotFoundError("Account");
    }

    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    return handleError(error, RESPONSE_SOURCE.API) as APIResponse;
  }
}
