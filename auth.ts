import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { OAUTH_PROVIDERS } from "./constants/auth";
import { IAccountDoc } from "./databases/account.model";
import { IUserDoc } from "./databases/user.model";
import { api } from "./lib/api";
import { SignInSchema } from "./lib/validations";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Google,
    Credentials({
      async authorize(credentials) {
        console.log("credentials", credentials);
        const validatedCredentials = SignInSchema.safeParse(credentials);
        if (!validatedCredentials.success) return null;

        const { email, password } = validatedCredentials.data;
        const { data: existingAccount } =
          (await api.accounts.getByProviderAccountId(
            email
          )) as ActionResponse<IAccountDoc>;

        if (!existingAccount) return null;
        const { data: existingUser } = (await api.users.getByEmail(
          email
        )) as APIResponse<IUserDoc>;

        if (!existingUser) return null;

        const isPasswordValid = await bcrypt.compare(
          password,
          existingUser.password
        );

        if (!isPasswordValid) return null;

        return {
          id: existingUser._id.toString(),
          email: existingUser.email,
          name: existingUser.name,
          image: existingUser.image,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub as string;
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        const { data: existingAccount, success } =
          (await api.accounts.getByProviderAccountId(
            account.type === "credentials"
              ? (token.email as string)
              : account.providerAccountId
          )) as APIResponse<IAccountDoc>;

        if (!success || !existingAccount) return token;

        const userId = existingAccount.userId;

        if (userId) {
          token.sub = userId.toString();
        }
      }

      return token;
    },
    async signIn({ user, profile, account }) {
      console.log("signIn", { user, profile, account });
      if (account?.type === "credentials") return true;
      if (!account || !user) return false;

      const userInfo = {
        name: user.name!,
        email: user.email!,
        image: user.image!,
        username:
          account.provider === OAUTH_PROVIDERS.GITHUB
            ? (profile?.login as string)
            : (user?.name?.toLowerCase() as string),
      };

      const { success } = (await api.auth.signInWithOAuth({
        user: userInfo,
        provider: account.provider as OAuthProvider,
        providerAccountId: account.providerAccountId,
      })) as APIResponse;

      if (!success) return false;

      return true;
    },
  },
});
