import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useNotificationCount() {
  return useQuery({
    queryKey: ["notificationCount"],
    queryFn: () =>
      axios.get(
        "https://route-posts.routemisr.com/notifications?page=1&limit=20",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      ),
  });
}
