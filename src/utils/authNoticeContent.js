import { POST_LOGIN_ACTION_OPEN_CREATE_POST } from "./postLoginRedirect";

export const DEFAULT_AUTH_NOTICE = {
  title: "Sign in required",
  description: "This feature is only available to signed-in accounts.",
};

export const CREATE_POST_AUTH_NOTICE = {
  title: "Sign in to create a post",
  description: "Posting is only available to signed-in accounts.",
  postLoginAction: POST_LOGIN_ACTION_OPEN_CREATE_POST,
};

export const protectedRouteNotices = {
  "/profile": {
    title: "Sign in to view your profile",
    description:
      "Your profile and account tools are only available to signed-in users.",
  },
  "/messages": {
    title: "Sign in to open messages",
    description:
      "Messaging is only available after you sign in to your account.",
  },
  "/community": {
    title: "Sign in to join communities",
    description: "Community spaces are only available to signed-in users.",
  },
  "/complaints": {
    title: "Sign in to submit complaints",
    description:
      "Complaints and support tracking are only available to signed-in users.",
  },
  "/notifications": {
    title: "Sign in to view notifications",
    description:
      "Notifications are only available after you sign in to your account.",
  },
  "/student-portal": {
    title: "Sign in to open the student portal",
    description:
      "The student portal is only available to signed-in student accounts.",
  },
  "/settings": {
    title: "Sign in to open settings",
    description:
      "Account settings are only available to signed-in users.",
  },
};

export function getAuthNoticeForPath(pathname) {
  return protectedRouteNotices[pathname] || DEFAULT_AUTH_NOTICE;
}
