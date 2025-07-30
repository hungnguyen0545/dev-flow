import Image from "next/image";
import Link from "next/link";

import { auth } from "@/auth";
import UserAvatar from "@/components/avatar/UserAvatar";

import MobileNavigation from "./MobileNavigation";
import Theme from "./Theme";

const Navbar = async () => {
  const session = await auth();

  return (
    <div className="flex-between background-light900_dark200 w-full fixed z-50 p-6 sm:px-12 gap-5 dark:shadow-none shadow-light-300">
      <Link href="/" className="flex items-center gap-1">
        <Image
          src="/images/site-logo.svg"
          alt="Dev Overflow Logo"
          width={23}
          height={23}
        />
        <p className="h2-bold font-space-grotesk text-dark-100 dark:text-light-900 max-sm:hidden">
          Dev <span className="text-primary-500">Overflow</span>
        </p>
      </Link>
      <p> Search Engine</p>
      <div className="flex-between gap-5">
        <Theme />
        <MobileNavigation userId={session?.user?.id} />

        {session?.user?.id && (
          <UserAvatar
            userId={session?.user?.id}
            name={session?.user?.name || ""}
            imageURL={session?.user?.image || ""}
          />
        )}
      </div>
    </div>
  );
};

export default Navbar;
