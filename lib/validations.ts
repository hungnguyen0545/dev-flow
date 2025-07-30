import { z } from "zod";

export const SignInSchema = z.object({
  email: z
    .email({ message: "Please provide a valid email address." })
    .min(1, { message: "Email is required." }),

  password: z
    .string()
    .min(6, {
      message: "Password must be at least 6 characters long.",
    })
    .max(100, { message: "Password cannot exceed 100 characters." }),
});

export const SignUpSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(30, { message: "Username cannot exceed 30 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores.",
    }),

  name: z
    .string()
    .min(1, { message: "Name is required." })
    .max(50, {
      message: "Name cannot exceed 50 characters.",
    })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces.",
    }),

  email: z
    .email({ message: "Please provide a valid email address." })
    .min(1, { message: "Email is required." }),

  password: z
    .string()
    .min(6, {
      message: "Password must be at least 6 characters long.",
    })
    .max(100, { message: "Password cannot exceed 100 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    }),
});

export const AskQuestionSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required." })
    .max(100, { message: "Title cannot exceed 100 characters." }),

  content: z
    .string()
    .min(1, { message: "Content is required." })
    .max(200, { message: "Content cannot exceed 200 characters." }),

  tags: z
    .array(z.string().min(1, { message: "Tag is required." }), {
      message: "Tags are required.",
    })
    .min(1, { message: "Tags are required." })
    .max(3, { message: "Tags cannot exceed 3 tags." }),
});

export const UserSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." }),
  // .max(30, { message: "Username cannot exceed 30 characters." })
  // .regex(/^[a-zA-Z0-9_]+$/, {
  //   message: "Username can only contain letters, numbers, and underscores.",
  // }),
  email: z
    .email({ message: "Please provide a valid email address." })
    .min(1, { message: "Email is required." }),
  image: z.url({ message: "Please provide a valid image URL." }).optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  portfolio: z
    .url({ message: "Please provide a valid portfolio URL." })
    .optional(),
  reputation: z.number().optional(),
});

export const AccountSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required." }),
  name: z.string().min(1, { message: "Name is required." }),
  image: z.url({ message: "Please provide a valid URL." }).optional(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    })
    .optional(),
  provider: z.string().min(1, { message: "Provider is required." }),
  providerAccountId: z
    .string()
    .min(1, { message: "Provider Account ID is required." }),
});

export const SignInWithOAuthSchema = z.object({
  provider: z.enum(["github", "google"]),
  providerAccountId: z
    .string()
    .min(1, { message: "Provider Account ID is required." }),
  user: UserSchema,
});
