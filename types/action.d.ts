export type SignInWithOAuthParams = {
  provider: OAuthProvider;
  providerAccountId: string;
  user: {
    name: string;
    username: string;
    email: string;
    image: string;
  };
};
