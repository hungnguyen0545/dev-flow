const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  PROFILE: "/profile",
  COMMUNITY: "/community",
  COLLECTION: "/collection",
  JOBS: "/jobs",
  ASK_QUESTION: "/ask-question",
  TAGS: (id: string) => `/tags/${id}`,
  QUESTION: (id: string) => `/questions/${id}`,
};

export default ROUTES;
