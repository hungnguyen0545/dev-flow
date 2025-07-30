import Image from "next/image";
import Link from "next/link";

import { auth } from "@/auth";
import ROUTES from "@/constants/routes";

import NavLinks from "./navbar/NavLinks";
import SignOutButton from "../buttons/SignOutButton";
import { Button } from "../ui/button";

const LeftSideBar = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  return (
    <div className="lg:w-[266px] max-sm:hidden h-screen custom-scrollbar background-light900_dark200 light-border sticky left-0 top-0 flex flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none">
      <div className="flex flex-1 flex-col gap-6">
        <NavLinks userId={userId} />
      </div>

      <div className="flex flex-col gap-3">
        {userId ? (
          <SignOutButton />
        ) : (
          <>
            <Button
              asChild
              className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none"
            >
              <Link href={ROUTES.SIGN_IN}>
                <Image
                  src="/icons/account.svg"
                  alt="Account"
                  width={20}
                  height={20}
                  className="invert-colors lg:hidden"
                />
                <span className="primary-text-gradient max-lg:hidden">
                  Sign In
                </span>
              </Link>
            </Button>

            <Button
              asChild
              className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none"
            >
              <Link href={ROUTES.SIGN_UP}>
                <Image
                  src="/icons/sign-up.svg"
                  alt="Account"
                  width={20}
                  height={20}
                  className="invert-colors lg:hidden"
                />
                <span className="primary-text-gradient max-lg:hidden">
                  Sign Up
                </span>
              </Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default LeftSideBar;
