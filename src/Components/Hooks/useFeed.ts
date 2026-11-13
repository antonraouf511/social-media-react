import { useInfiniteQuery } from "@tanstack/react-query";
import api from "../../api/client";
import { queryKeys } from "../../api/queryKeys";
import type { Post } from "../../Types/Posts.Type";

export type FeedFilter = "all" | "following" | "me";

const PAGE_SIZE = 10;

export function useFeed(only: FeedFilter) {
  return useInfiniteQuery({
    queryKey: queryKeys.feed(only),
    queryFn: async ({ pageParam }) => {
      const res = await api.get("/posts/feed", {
        params: { only, page: pageParam, limit: PAGE_SIZE },
      });
      const posts: Post[] = res.data?.data?.posts ?? res.data?.posts ?? [];
      const meta = res.data?.meta ?? {};
      return { posts, meta, page: pageParam as number };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const totalPages = lastPage.meta.totalPages ?? lastPage.meta.pages;
      if (typeof totalPages === "number" && lastPage.page >= totalPages) {
        return undefined;
      }
      if (lastPage.posts.length < PAGE_SIZE) return undefined;
      return lastPage.meta.nextPage ?? lastPage.page + 1;
    },
  });
}
