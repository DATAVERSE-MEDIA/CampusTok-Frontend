export const getPostOwnerId = (post: any) => {
  return (
    post?.author?.id ??
    post?.author?.user_id ??
    post?.author_id ??
    post?.user_id ??
    post?.created_by_id ??
    post?.created_by ??
    post?.user?.id ??
    null
  );
};

export const isAdminUser = (user: any) => {
  const role = String(user?.role || user?.userType || "").toLowerCase();

  return role.includes("admin");
};

export const canDeletePost = (post: any, user: any) => {
  if (!user) return false;

  const currentUserId = user?.id ?? user?.user_id ?? null;
  const postOwnerId = getPostOwnerId(post);

  if (
    currentUserId !== null &&
    postOwnerId !== null &&
    String(currentUserId) === String(postOwnerId)
  ) {
    return true;
  }

  if (
    user?.email &&
    post?.author?.email &&
    String(user.email).toLowerCase() === String(post.author.email).toLowerCase()
  ) {
    return true;
  }

  return isAdminUser(user);
};
