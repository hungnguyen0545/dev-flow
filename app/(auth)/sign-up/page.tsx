"use client";

import AuthForm from "@/components/forms/AuthForm";
import { AUTH_FORM_TYPES } from "@/constants/auth";
import { SignUpSchema } from "@/lib/validations";

const SignUp = () => {
  return (
    <AuthForm
      formType={AUTH_FORM_TYPES.SIGN_UP}
      schema={SignUpSchema}
      defaultValues={{
        username: "",
        name: "",
        email: "",
        password: "",
      }}
      onSubmit={(data) => Promise.resolve({ success: true, data })} // TODO: Implement onSubmit
    />
  );
};

export default SignUp;
