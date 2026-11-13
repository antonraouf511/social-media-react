export interface PostUser {
  _id: string;
  name: string;
  username: string;
  photo: string;
}

export interface Post {
  _id: string;
  id?: string;
  body?: string | null;
  image?: string | null;
  privacy?: "public" | "friends" | "private" | string;
  user: PostUser;
  sharedPost: Post | null;
  likes: string[];
  createdAt: string;
  commentsCount: number;
  topComment: TopComment | null;
  sharesCount: number;
  likesCount: number;
  isShare?: boolean;
  bookmarked?: boolean;
}

export interface TopComment {
  _id: string;
  content: string;
  image: string;
  commentCreator: PostUser;
  createdAt: string;
  likes: string[];
  likesCount?: number;
  parentComment: string | null;
  post: string;
}
