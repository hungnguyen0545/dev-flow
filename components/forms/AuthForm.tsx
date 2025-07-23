"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  Control,
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { z, ZodType } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AUTH_FORM_TYPES } from "@/constants/auth";
import ROUTES from "@/constants/routes";

type AuthFormProps<T extends FieldValues> = {
  formType: (typeof AUTH_FORM_TYPES)[keyof typeof AUTH_FORM_TYPES];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: ZodType<T, any, any>;
  defaultValues: DefaultValues<T>;
  onSubmit: (data: T) => Promise<{ success: boolean; data: T }>;
};

const AuthForm = <T extends FieldValues>({
  formType,
  schema,
  defaultValues,
  onSubmit,
}: AuthFormProps<T>) => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // 2. Define a submit handler.
  const handleSubmit: SubmitHandler<FieldValues> = async () => {
    // TODO: Authenticate User
  };

  const buttonText =
    formType === AUTH_FORM_TYPES.SIGN_IN ? "Sign In" : "Sign Up";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-10 space-y-6"
      >
        {Object.keys(defaultValues).map((field) => (
          <FormField
            key={field}
            name={field as Path<T>}
            control={form.control as unknown as Control<T>}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2.5">
                <FormLabel className="paragraph-medium text-dark400_light700">
                  {field.name === "email"
                    ? "Email Address"
                    : field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                </FormLabel>
                <FormControl>
                  <Input
                    required
                    type={field.name === "password" ? "password" : "text"}
                    {...field}
                    className="paragraph-regular no-focus background-light900_dark300 light-border-2 text-dark300_light700 min-h-12 border rounded-1.5"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button
          disabled={form.formState.isSubmitting}
          className="primary-gradient paragraph-medium min-h-12 w-full rounded-2 px-4 py-3 font-inter !text-light-900"
        >
          {form.formState.isSubmitting
            ? buttonText === "Sign In"
              ? "Signing In..."
              : "Signing Up..."
            : buttonText}
        </Button>

        {formType === AUTH_FORM_TYPES.SIGN_IN ? (
          <p>
            Don&apos;t have an account?{" "}
            <Link
              href={ROUTES.SIGN_UP}
              className="paragraph-semibold primary-text-gradient"
            >
              Sign Up
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <Link
              href={ROUTES.SIGN_IN}
              className="paragraph-semibold primary-text-gradient"
            >
              Sign In
            </Link>
          </p>
        )}
      </form>
    </Form>
  );
};

export default AuthForm;
