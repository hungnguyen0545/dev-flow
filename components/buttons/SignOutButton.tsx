import { LogOut } from "lucide-react";

import { signOut } from "@/auth";
import { cn } from "@/lib/utils";

import { Button } from "../ui/button";

const SignOutButton = ({ isMobileNav }: { isMobileNav?: boolean }) => {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <Button
        type="submit"
        className="base-medium w-fit !bg-transparent px-4 py-3"
      >
        <LogOut className="size-5 text-black dark:text-white" />
        <span
          className={cn(
            `text-dark300_light900`,
            isMobileNav ? "" : "max-lg:hidden"
          )}
        >
          Logout
        </span>
      </Button>
    </form>
  );
};

export default SignOutButton;
