import { Helmet } from "react-helmet";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Loader from "../../Components/Loader/Loader";
import type { NotificationType } from "../../Types/notificationType";

export default function Notifications() {
  const queryClient = useQueryClient();

  // Fetch notifications
  function fetchNotifications() {
    return axios.get(
      "https://route-posts.routemisr.com/notifications?page=1&limit=20",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
  });

  const notifications =
    data?.data?.data?.notifications ||
    data?.data?.notifications ||
    data?.data ||
    [];

  // Mark all as read mutation
  function markAllApi() {
    return axios.patch(
      "https://route-posts.routemisr.com/notifications/read-all",
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { mutate: markAllMutate } = useMutation({
    mutationFn: markAllApi,
    onSuccess: () => {
      toast.success("All notifications marked as read");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message || "Failed to mark notifications as read",
      );
    },
  });

  const markAllAsRead = () => {
    markAllMutate();
  };

  // Mark Notification As Read
  function markNotificationAsReadApi(notificationId: string) {
    return axios.patch(
      `https://route-posts.routemisr.com/notifications/${notificationId}/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { mutate: markNotificationAsReadMutate } = useMutation({
    mutationFn: markNotificationAsReadApi,
    onSuccess: () => {
      toast.success("Notification marked as read");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message || "Failed to mark notification as read",
      );
    },
  });

  if (isLoading) return <Loader />;
  if (isError) {
    const errorMsg =
      error instanceof Error ? error.message : "Failed to load notifications";
    return (
      <div className="text-center py-20 text-rose-500 font-semibold">
        {errorMsg}
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Notifications — pulse</title>
        <meta
          name="description"
          content="View your recent activity and notifications."
        />
      </Helmet>

      <div className="min-h-screen bg-[#F7F8FA] text-[#1F2937] py-8 px-4 sm:px-8 lg:px-12 font-sans antialiased w-full">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E7EB] shadow-[0_4px_24px_rgba(16,24,40,0.05)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2937] flex items-center gap-3">
                <Bell className="text-slate-900" size={28} /> Notifications
              </h1>
              <p className="text-sm text-[#6B7280] mt-1">
                Stay updated with interactions on your posts and profile.
              </p>
            </div>
            <button
              onClick={markAllAsRead}
              className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-bold shadow-md transition cursor-pointer flex items-center gap-2 shrink-0"
            >
              <CheckCheck size={16} /> Mark all as read
            </button>
          </div>

          {/* Notifications List */}
          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-[0_4px_24px_rgba(16,24,40,0.05)] overflow-hidden divide-y divide-slate-100">
            {notifications.length > 0 ? (
              notifications.map((notif: NotificationType) => (
                <div
                  key={notif._id}
                  className={`p-4 sm:p-5 flex items-start gap-4 transition hover:bg-slate-50/80 relative ${
                    !notif.isRead ? "bg-slate-50/50" : ""
                  }`}
                >
                  {!notif.isRead && (
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-600"></span>
                  )}

                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 overflow-hidden">
                    {notif.actor?.photo ? (
                      <img
                        src={notif?.actor?.photo}
                        alt={notif?.actor?.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Bell size={18} className="text-slate-600" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-[#1F2937] leading-relaxed">
                      <span className="font-bold">{notif?.actor?.name}</span>{" "}
                      {notif.entity?.body}
                    </p>
                    <span className="text-[11px] text-[#6B7280] mt-1 block">
                      {notif?.createdAt
                        ? new Date(notif.createdAt).toLocaleDateString()
                        : "Recently"}
                    </span>
                  </div>

                  <button
                    onClick={() => {markNotificationAsReadMutate(notif._id);}}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer shrink-0"
                    title="Delete notification"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-[#6B7280]">
                <Bell size={36} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium text-sm">No notifications found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
