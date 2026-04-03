export const SHOW_AUTH_NOTICE_EVENT = "campustok:show-auth-notice";

export function requestAuthNotice(detail = {}) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(SHOW_AUTH_NOTICE_EVENT, { detail }));
}
