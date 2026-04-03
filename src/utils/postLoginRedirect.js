const POST_LOGIN_REDIRECT_KEY = "campustok:post-login-redirect";
const POST_LOGIN_ACTION_KEY = "campustok:post-login-action";
export const POST_LOGIN_ACTION_OPEN_CREATE_POST = "open-create-post";

function isSafePostLoginAction(action) {
  return action === POST_LOGIN_ACTION_OPEN_CREATE_POST;
}

function isSafeRedirectPath(path) {
  return (
    typeof path === "string" &&
    path.startsWith("/") &&
    !path.startsWith("//") &&
    path !== "/login" &&
    path !== "/auth-required"
  );
}

export function getDefaultPostLoginRedirect(userType) {
  if (userType === "student") {
    return "/student-dashboard";
  }

  if (userType === "institution") {
    return "/institution-dashboard";
  }

  return "/general-dashboard";
}

export function sanitizePostLoginRedirect(path) {
  return isSafeRedirectPath(path) ? path : null;
}

export function storePostLoginRedirect(path) {
  if (typeof window === "undefined") {
    return;
  }

  const safePath = sanitizePostLoginRedirect(path);

  if (safePath) {
    window.localStorage.setItem(POST_LOGIN_REDIRECT_KEY, safePath);
    return;
  }

  window.localStorage.removeItem(POST_LOGIN_REDIRECT_KEY);
}

export function getStoredPostLoginRedirect() {
  if (typeof window === "undefined") {
    return null;
  }

  return sanitizePostLoginRedirect(
    window.localStorage.getItem(POST_LOGIN_REDIRECT_KEY)
  );
}

export function clearStoredPostLoginRedirect() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(POST_LOGIN_REDIRECT_KEY);
}

export function sanitizePostLoginAction(action) {
  return isSafePostLoginAction(action) ? action : null;
}

export function storePostLoginAction(action) {
  if (typeof window === "undefined") {
    return;
  }

  const safeAction = sanitizePostLoginAction(action);

  if (safeAction) {
    window.localStorage.setItem(POST_LOGIN_ACTION_KEY, safeAction);
    return;
  }

  window.localStorage.removeItem(POST_LOGIN_ACTION_KEY);
}

export function getStoredPostLoginAction() {
  if (typeof window === "undefined") {
    return null;
  }

  return sanitizePostLoginAction(
    window.localStorage.getItem(POST_LOGIN_ACTION_KEY)
  );
}

export function clearStoredPostLoginAction() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(POST_LOGIN_ACTION_KEY);
}

export function resolvePostLoginRedirect({ requestedPath, userType }) {
  return (
    sanitizePostLoginRedirect(requestedPath) ||
    getStoredPostLoginRedirect() ||
    getDefaultPostLoginRedirect(userType)
  );
}

export function resolvePostLoginAction(requestedAction) {
  return (
    sanitizePostLoginAction(requestedAction) || getStoredPostLoginAction() || null
  );
}
