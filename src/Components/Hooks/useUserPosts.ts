import { useQuery } from "@tanstack/react-query";
import api from "../../api/client";
import { queryKeys } from "../../api/queryKeys";

export function useUserPosts(userId: string) {
  return useQuery({
    queryKey: queryKeys.userPosts(userId),
    queryFn: () => api.get(`/users/${userId}/posts`),
    enabled: !!userId,
    select: (res) => res.data?.data?.posts ?? res.data?.posts ?? [],
  });
}
