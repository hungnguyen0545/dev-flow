"use client";

import { signOut } from "next-auth/react";

import ROUTES from "@/constants/routes";

import { Button } from "../ui/button";

export function SignOutBtn() {
  return (
    <Button
      onClick={() => signOut({ redirectTo: ROUTES.SIGN_IN })}
      className="small-medium border-t-cyan-50 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none"
    >
      Sign Out
    </Button>
  );
}
