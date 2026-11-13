import { useQuery } from "@tanstack/react-query";
import api, { getStoredToken } from "../../api/client";
import { queryKeys } from "../../api/queryKeys";

export function useBookmarks() {
  return useQuery({
    queryKey: queryKeys.bookmarks,
    queryFn: () => api.get("/users/bookmarks"),
    enabled: !!getStoredToken(),
    select: (res) => {
      const bookmarks = res.data?.data?.bookmarks ?? res.data?.bookmarks ?? [];
      return [...bookmarks].reverse();
    },
  });
}
