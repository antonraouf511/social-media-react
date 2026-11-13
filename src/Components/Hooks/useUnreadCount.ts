import { useQuery } from "@tanstack/react-query";
import api, { getStoredToken } from "../../api/client";
import { queryKeys } from "../../api/queryKeys";

export function useUnreadCount() {
  return useQuery({
    queryKey: queryKeys.unreadCount,
    queryFn: () => api.get("/notifications/unread-count"),
    enabled: !!getStoredToken(),
    refetchInterval: 30000,
    select: (res) =>
      res.data?.data?.unreadCount ?? res.data?.unreadCount ?? 0,
  });
}
