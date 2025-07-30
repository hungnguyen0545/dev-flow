"use client";

import { z } from "zod";

import AuthForm from "@/components/forms/AuthForm";
import { AUTH_FORM_TYPES } from "@/constants/auth";
import { signInWithCredentials } from "@/lib/actions/auth.action";
import { SignInSchema } from "@/lib/validations";

const SignIn = () => {
  const handleSignIn = async (data: z.infer<typeof SignInSchema>) => {
    return await signInWithCredentials({ params: data });
  };

  return (
    <AuthForm
      formType={AUTH_FORM_TYPES.SIGN_IN}
      schema={SignInSchema}
      defaultValues={{
        email: "",
        password: "",
      }}
      onSubmit={handleSignIn}
    />
  );
};

export default SignIn;
