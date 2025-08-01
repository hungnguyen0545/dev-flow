const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  COMMUNITY: "/community",
  COLLECTION: "/collection",
  JOBS: "/jobs",
  ASK_QUESTION: "/ask-question",
  QUESTIONS: (id: string) => `/questions/${id}`,
  QUESTIONS_EDIT: (id: string) => `/questions/${id}/edit`,
  PROFILE: (id: string) => `/profile/${id}`,
  TAGS: (id: string) => `/tags/${id}`,
  QUESTION: (id: string) => `/questions/${id}`,
};

export default ROUTES;
