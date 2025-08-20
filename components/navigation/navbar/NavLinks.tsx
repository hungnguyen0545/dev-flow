"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { SheetClose } from "@/components/ui/sheet";
import { SIDEBAR_ITEMS } from "@/constants";
import ROUTES from "@/constants/routes";
import { cn } from "@/lib/utils";

const NavLinks = ({
  isMobileNav,
  userId,
}: {
  isMobileNav?: boolean;
  userId?: string;
}) => {
  const pathname = usePathname();

  return (
    <section className="flex h-full flex-col gap-6">
      {SIDEBAR_ITEMS.map((link) => {
        const isActive =
          pathname === link.route ||
          (pathname?.includes(link.route) && link.route.length > 1);
        if (link.route === ROUTES.PROFILE("")) {
          if (userId) link.route = `${link.route}${userId}`;
          else return null;
        }

        const LinkComponent = (
          <Link
            key={link.label}
            href={link.route as string}
            className={cn(
              isActive
                ? "primary-gradient rounded-lg text-light-900"
                : "text-dark300_light900",
              "flex items-center justify-start gap-4 bg-transparent p-4"
            )}
          >
            <Image
              src={link.imgURL}
              alt={link.label}
              width={20}
              height={20}
              className={cn({ "invert-colors": !isActive })}
            />
            <p
              className={cn(
                isActive ? "base-bold" : "base-medium",
                !isMobileNav && "max-lg:hidden"
              )}
            >
              {link.label}
            </p>
          </Link>
        );

        return isMobileNav ? (
          <SheetClose asChild key={link.route}>
            {LinkComponent}
          </SheetClose>
        ) : (
          <React.Fragment key={link.route}>{LinkComponent}</React.Fragment>
        );
      })}
    </section>
  );
};

export default NavLinks;
