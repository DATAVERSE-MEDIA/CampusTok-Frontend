export function hasStoredAuthToken() {
  if (typeof window === "undefined") {
    return false;
  }

  return Boolean(window.localStorage.getItem("auth_token"));
}

export function isUserSessionAuthenticated(isAuthenticated) {
  return Boolean(isAuthenticated) || hasStoredAuthToken();
}
