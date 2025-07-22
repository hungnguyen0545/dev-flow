"use client";

import AuthForm from "@/components/forms/AuthForm";
import { AUTH_FORM_TYPES } from "@/constants/auth";
import { SignInSchema } from "@/lib/validations";

const SignIn = () => {
  return (
    <AuthForm
      formType={AUTH_FORM_TYPES.SIGN_IN}
      schema={SignInSchema}
      defaultValues={{
        email: "",
        password: "",
      }}
      onSubmit={(data) => Promise.resolve({ success: true, data })} // TODO: Implement onSubmit
    />
  );
};

export default SignIn;
