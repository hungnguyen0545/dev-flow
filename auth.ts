import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { OAUTH_PROVIDERS } from "./constants/auth";
import { IAccountDoc } from "./databases/account.model";
import { api } from "./lib/api";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub, Google],
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

      console.log("userInfo", userInfo);
      const { success } = (await api.auth.signInWithOAuth({
        user: userInfo,
        provider: account.provider as OAuthProvider,
        providerAccountId: account.providerAccountId,
      })) as APIResponse;

      console.log("success", success);

      if (!success) return false;

      return true;
    },
  },
});
