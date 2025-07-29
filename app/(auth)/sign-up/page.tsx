"use client";

import { z } from "zod";

import AuthForm from "@/components/forms/AuthForm";
import { AUTH_FORM_TYPES } from "@/constants/auth";
import { signUpWithCredentials } from "@/lib/actions/auth.action";
import { SignUpSchema } from "@/lib/validations";

const SignUp = () => {
  const handleSignUp = async (data: z.infer<typeof SignUpSchema>) => {
    return await signUpWithCredentials({ params: data });
  };

  return (
    <AuthForm
      formType={AUTH_FORM_TYPES.SIGN_UP}
      schema={SignUpSchema}
      defaultValues={{
        name: "",
        username: "",
        email: "",
        password: "",
      }}
      onSubmit={handleSignUp}
    />
  );
};

export default SignUp;
