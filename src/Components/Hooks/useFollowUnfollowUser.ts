import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../../api/client";
import { queryKeys } from "../../api/queryKeys";

export function useFollowUnfollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => api.put(`/users/${userId}/follow`, {}),
    onSuccess: (res) => {
      toast.success(res.data?.message || "Follow status updated");
      queryClient.invalidateQueries({ queryKey: queryKeys.suggestions });
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update follow status");
    },
  });
}
