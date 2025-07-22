"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import React from "react";
import { toast } from "sonner";

import { OAUTH_PROVIDERS } from "@/constants/auth";
import ROUTES from "@/constants/routes";

import { Button } from "../ui/button";

const SocialAuthForm = () => {
  const buttonClass =
    "background-dark400_light900 body-medium text-dark200_light800 min-h-12 flex-1 rounded-2 px-4 py-3.5 cursor-pointer";
  const handleSignIn = async (
    provider: (typeof OAUTH_PROVIDERS)[keyof typeof OAUTH_PROVIDERS]
  ) => {
    try {
      await signIn(provider, {
        redirectTo: ROUTES.HOME,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    }
  };

  return (
    <div className="mt-10 flex flex-wrap gap-2.5">
      <Button
        className={buttonClass}
        onClick={() => handleSignIn(OAUTH_PROVIDERS.GITHUB)}
      >
        <Image
          src="/icons/github.svg"
          alt="GitHub Logo"
          width={20}
          height={20}
          className="object-contain inverted-colors: mr-2.5"
        />
        <span> Log in with GitHub</span>
      </Button>
      <Button
        className={buttonClass}
        onClick={() => handleSignIn(OAUTH_PROVIDERS.GOOGLE)}
      >
        <Image
          src="/icons/google.svg"
          alt="Google Logo"
          width={20}
          height={20}
          className="object-contain inverted-colors: mr-2.5"
        />
        <span> Log in with Google</span>
      </Button>
    </div>
  );
};

export default SocialAuthForm;
