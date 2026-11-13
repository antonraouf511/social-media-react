import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import {
  Lock,
  User,
  Bell,
  Shield,
  Key,
  Save,
  Eye,
  EyeOff,
  Camera,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProfile } from "../../Components/Hooks/useProfile";

export default function Settings() {
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<
    "security" | "account" | "notifications"
  >("security");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  // Profile Info state
  const [profileName, setProfileName] = useState("Anton");
  const [profileBio, setProfileBio] = useState(
    "Quiet creator and developer sharing insights, moments, and building calm digital experiences.",
  );
  const [profileLocation, setProfileLocation] = useState("Cairo, Egypt");
  const [profileWebsite, setProfileWebsite] = useState("https://pulse.social");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB.");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  //-------------------------------- Profile Update Handler --------------------------------

  const handleProfileUpdate = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Choose a photo first.");
      return;
    }
    uploadProfilePicture(selectedFile);
  };

  //-------------------------------- upload Profile picture --------------------------------

  function uploadProfilePictureApi(file: File) {
    const data = new FormData();
    data.append("photo", file);
    return axios.put(
      `https://route-posts.routemisr.com/users/upload-photo`,
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { data: user } = useProfile();

  const { mutate: uploadProfilePicture, isPending: isUploadingProfilePicture } =
    useMutation({
      mutationFn: uploadProfilePictureApi,
      onSuccess: (res) => {
        toast.success(res.data.message);
        setSelectedFile(null);
        setPreviewUrl(null);
        queryClient.invalidateQueries({ queryKey: ["profile"] });
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || "Failed to update profile.");
      },
    });

  //-------------------------------- Password Change Handler --------------------------------
  const handlePasswordChange = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    changePasswordMutate({
      password: currentPassword,
      newPassword: newPassword,
    });
  };

  function changePasswordApi(data: { password: string; newPassword: string }) {
    return axios.patch(
      `https://route-posts.routemisr.com/users/change-password`,
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { mutate: changePasswordMutate, isPending: changePasswordPending } =
    useMutation({
      mutationFn: changePasswordApi,
      onSuccess: (res) => {
        toast.success(res.data.message);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      },
      onError: (err: any) => {
        toast.error(
          err.response?.data?.message || "Failed to change password.",
        );
      },
    });

  return (
    <>
      <Helmet>
        <title>Settings — pulse</title>
        <meta
          name="description"
          content="Manage your account settings, security, and profile information."
        />
      </Helmet>

      <div className="min-h-screen bg-[#F7F8FA] text-[#1F2937] py-8 px-4 sm:px-8 lg:px-12 font-sans antialiased">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E7EB] shadow-[0_4px_24px_rgba(16,24,40,0.05)]">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2937] flex items-center gap-3">
              <Shield className="text-slate-900" size={28} /> Account Settings
            </h1>
            <p className="text-sm text-[#6B7280] mt-1">
              Manage your password, security preferences, and personal profile
              information.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Settings Sidebar Tabs */}
            <div className="md:col-span-1 space-y-2">
              <div className="bg-white rounded-3xl p-3 border border-[#E5E7EB] shadow-[0_4px_24px_rgba(16,24,40,0.05)] space-y-1">
                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer text-left ${
                    activeTab === "security"
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F7F8FA]"
                  }`}
                >
                  <Key size={18} /> Password & Security
                </button>
                <button
                  onClick={() => setActiveTab("account")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer text-left ${
                    activeTab === "account"
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F7F8FA]"
                  }`}
                >
                  <User size={18} /> Profile Info
                </button>
                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer text-left ${
                    activeTab === "notifications"
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F7F8FA]"
                  }`}
                >
                  <Bell size={18} /> Notifications
                </button>
              </div>
            </div>

            {/* Settings Content Area */}
            <div className="md:col-span-3 space-y-6">
              {activeTab === "security" && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E7EB] shadow-[0_4px_24px_rgba(16,24,40,0.05)] space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-[#1F2937] flex items-center gap-2">
                      <Lock size={20} className="text-slate-900" /> Change
                      Password
                    </h2>
                    <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
                      Ensure your account is using a long, random password to
                      stay secure.
                    </p>
                  </div>

                  <form
                    onSubmit={handlePasswordChange}
                    className="space-y-4 max-w-xl"
                  >
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrent ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-slate-900 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrent(!showCurrent)}
                          className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showCurrent ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNew ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-slate-900 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew(!showNew)}
                          className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-slate-900"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        disabled={changePasswordPending}
                        type="submit"
                        className="px-6 py-3 disabled:opacity-60 rounded-xl bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-bold shadow-md transition cursor-pointer flex items-center gap-2"
                      >
                        <Save size={16} /> {changePasswordPending ? "Updating..." : "Update Password"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === "account" && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E7EB] shadow-[0_4px_24px_rgba(16,24,40,0.05)] space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-[#1F2937] flex items-center gap-2">
                      <User size={20} className="text-slate-900" /> Edit Profile
                      Information
                    </h2>
                    <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
                      Update your public profile details, bio, location, and
                      avatar.
                    </p>
                  </div>

                  <form
                    onSubmit={handleProfileUpdate}
                    className="space-y-5 max-w-xl"
                  >
                    {/* Centered & Larger Profile Photo Upload */}
                    <div className="flex flex-col items-center justify-center space-y-3 pb-6 border-b border-slate-100">
                      <div className="relative group cursor-pointer">
                        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-[0_8px_24px_rgba(16,24,40,0.12)] bg-white">
                          <img
                            src={user?.photo}
                            alt="Profile preview"
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        </div>
                        <label
                          className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-slate-900 hover:bg-black text-white border-2 border-white shadow-md flex items-center justify-center transition cursor-pointer"
                          title="Upload new photo"
                        >
                          <Camera size={18} />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                      <div className="text-center space-y-0.5">
                        <p className="text-xs font-bold text-slate-700">
                          {selectedFile
                            ? selectedFile.name
                            : "Click camera icon to change photo"}
                        </p>
                        <p className="text-[11px] text-slate-400 font-medium">
                          Recommended: Square PNG, JPG (max 5MB)
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Name
                      </label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-slate-900"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Bio
                      </label>
                      <textarea
                        rows={3}
                        value={profileBio}
                        onChange={(e) => setProfileBio(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-slate-900 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                          Location
                        </label>
                        <input
                          type="text"
                          value={profileLocation}
                          onChange={(e) => setProfileLocation(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-slate-900"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                          Website
                        </label>
                        <input
                          type="text"
                          value={profileWebsite}
                          onChange={(e) => setProfileWebsite(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-slate-900"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        disabled={isUploadingProfilePicture}
                        type="submit"
                        className="px-6 py-3 disabled:opacity-60 rounded-xl bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-bold shadow-md transition cursor-pointer flex items-center gap-2"
                      >
                        <Save size={16} />{" "}
                        {isUploadingProfilePicture
                          ? "Saving..."
                          : "Save Changes"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E7EB] shadow-[0_4px_24px_rgba(16,24,40,0.05)] space-y-6">
                  <h2 className="text-lg font-bold text-[#1F2937]">
                    Notification Preferences
                  </h2>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition">
                      <div>
                        <div className="text-sm font-bold text-[#1F2937]">
                          Email Notifications
                        </div>
                        <div className="text-xs text-[#6B7280]">
                          Receive email updates about your account activity.
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-5 h-5 accent-slate-900 rounded cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition">
                      <div>
                        <div className="text-sm font-bold text-[#1F2937]">
                          Push Notifications
                        </div>
                        <div className="text-xs text-[#6B7280]">
                          Receive push notifications when someone follows or
                          comments.
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-5 h-5 accent-slate-900 rounded cursor-pointer"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
