export const OPEN_CREATE_POST_EVENT = "campustok:open-create-post";

export function requestOpenCreatePost() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(OPEN_CREATE_POST_EVENT));
}
