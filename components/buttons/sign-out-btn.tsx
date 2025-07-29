"use client";

import { signOut } from "@/auth";
import ROUTES from "@/constants/routes";

import { Button } from "../ui/button";

export function SignOutBtn() {
  const handleSignOut = async () => {
    await signOut({ redirectTo: ROUTES.SIGN_IN });
  };

  return (
    <Button
      onClick={handleSignOut}
      className="small-medium border-t-cyan-50 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none"
    >
      Sign Out
    </Button>
  );
}
