export const queryKeys = {
  profile: ["profile"] as const,
  feed: (only: string) => ["posts", "feed", only] as const,
  userPosts: (userId: string) => ["posts", "user", userId] as const,
  singlePost: (postId: string) => ["posts", postId] as const,
  postComments: (postId: string) => ["posts", postId, "comments"] as const,
  postLikes: (postId: string) => ["posts", postId, "likes"] as const,
  commentReplies: (commentId: string) => ["comments", commentId, "replies"] as const,
  suggestions: ["suggestions"] as const,
  bookmarks: ["bookmarks"] as const,
  notifications: ["notifications"] as const,
  unreadCount: ["notifications", "unread"] as const,
};
