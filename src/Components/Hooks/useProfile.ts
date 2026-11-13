import { useQuery } from "@tanstack/react-query";
import api, { getStoredToken } from "../../api/client";
import { queryKeys } from "../../api/queryKeys";

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: () => api.get("/users/profile-data"),
    enabled: !!getStoredToken(),
    select: (res) => res.data?.data?.user ?? res.data?.user,
  });
}
