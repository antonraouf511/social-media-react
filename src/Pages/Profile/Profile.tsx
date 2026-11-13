import { useContext, useState } from "react";
import { Helmet } from "react-helmet";
import { AuthContext } from "../../Context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import PostComponent from "../../Components/PostComponent/PostComponent";
import PostCreation from "../../Components/PostCreation/PostCreation";
import { PostSkeleton, ProfileSkeleton } from "../../Components/Skeleton/PostSkeleton";
import type { Post as PostType } from "../../Types/Posts.Type";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Calendar, FileText,
  CheckCircle2, Edit3, MapPin,
  Link as LinkIcon, Camera, Bookmark
} from "lucide-react";
import { useBookmarks } from "../../Components/Hooks/useBookmarks";
import { useProfile } from "../../Components/Hooks/useProfile";

export default function Profile() {
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<"posts" | "followers" | "following" | "bookmarks">(
    location.state?.defaultTab || "posts"
  );
  const { data: bookmarkedPosts = [] } = useBookmarks();
  const { data: user } = useProfile();


  // ------------------------ get user profile data ------------------------
  function getMyProfile() {
    return axios.get("https://route-posts.routemisr.com/users/profile-data", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getMyProfileData"],
    queryFn: getMyProfile,
  });




  //---------------------- get user posts ----------------------
  function getUserPosts() {
    return axios.get(`https://route-posts.routemisr.com/users/${userId}/posts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const { data: userPostsData, isLoading: isUserPostsLoading, isError: isUserPostsError} = useQuery({
    queryKey: ["getUserPosts", userId],
    queryFn: getUserPosts,
    enabled: !!data && !isLoading && !isError , 
  });
  console.log("userPostsData from useQuery:", userPostsData);
  const userPostsLength: number = userPostsData?.data.data.posts.length || 0;





  // Extract the posts array from the response data
  if (isLoading || isUserPostsLoading ) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] py-8 px-4 sm:px-8 max-w-4xl mx-auto space-y-6">
        <ProfileSkeleton />
        <PostSkeleton />
      </div>
    );
  }

  if (isError || isUserPostsError) {
    const errorMessage = error instanceof Error ? error.message : "Error loading profile";
    return <div className="text-center py-16 text-rose-500 font-medium">{errorMessage}</div>;
  }

  const userPosts: PostType[] = userPostsData?.data.data.posts ;
  


  return (
    <>
      <Helmet>
        <title>{user?.username} — Profile | Social App</title>
        <meta name="description" content="Modern full-width user profile page" />
      </Helmet>

      {/* Main Page Container - Full Width across the screen */}
      <div className="min-h-screen bg-[#F7F8FA] text-[#1F2937] pb-24 font-sans antialiased w-full">

        {/* Full-width wrapper with responsive horizontal padding */}
        <div className="w-full px-4 sm:px-8 lg:px-12 pt-6 space-y-8">

          {/* Profile Header Card - Full Width */}
          <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(16,24,40,0.06)] border border-[#E5E7EB] overflow-hidden">

            {/* Wide cover image with soft sky/pastel gradient & bottom fade */}
            <div className="relative h-64 sm:h-80 w-full bg-linear-to-r from-slate-900 via-slate-800 to-indigo-950 overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent"></div>
              <div className="absolute top-6 right-6 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-semibold tracking-wide border border-white/10">
                Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
              </div>
            </div>

            {/* Profile Info Section */}
            <div className="px-6 sm:px-10 pb-8 pt-0 relative">

              {/* Avatar & Edit Profile Button Row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between -mt-16 sm:-mt-20 mb-6 gap-4">
                <div className="relative group">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white shadow-[0_6px_20px_rgba(16,24,40,0.12)] bg-white">
                    <img
                      src={user?.photo}
                      alt={user?.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => navigate("/settings")}
                    className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-slate-900 hover:bg-black text-white border-2 border-white shadow-md flex items-center justify-center transition cursor-pointer"
                    title="Change profile photo"
                  >
                    <Camera size={16} />
                  </button>
                </div>

                <button
                  onClick={() => navigate("/settings")}
                  className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-bold shadow-md transition cursor-pointer flex items-center gap-2"
                >
                  <Edit3 size={16} /> Edit profile
                </button>
              </div>

              {/* Name & Username */}
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#1F2937]">{user?.username}</h1>
                  <span title="Verified">
                    <CheckCircle2 size={22} className="text-slate-900" />
                  </span>
                </div>
                <p className="text-sm sm:text-base text-[#6B7280] font-medium">@{user?.username}</p>
              </div>

              {/* Bio */}
              <p className="text-sm sm:text-base text-[#1F2937] font-normal leading-relaxed mt-4 max-w-2xl">
                Front-End Developer | React.js | JavaScript | TypeScript
              </p>

              {/* Meta details */}
              <div className="flex flex-wrap items-center gap-6 mt-5 pt-5 border-t border-[#E5E7EB] text-xs sm:text-sm text-[#6B7280]">
                <span className="flex items-center gap-2">
                  <MapPin size={16} className="text-slate-800" /> Cairo, Egypt
                </span>
                <span className="flex items-center gap-2">
                  <LinkIcon size={16} className="text-slate-800" />
                  <a href="https://pulse.social" target="_blank" rel="noreferrer" className="hover:underline text-slate-900 font-medium">https://pulse.social</a>
                </span>
                <span className="flex items-center gap-2">
                  <Calendar size={16} className="text-slate-800" /> Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                </span>
              </div>
            </div>

            {/* Stats Strip (Followers, Following, Bookmarks) */}
            <div className="grid grid-cols-3 border-t border-[#E5E7EB] bg-[#FAFAFC] py-5 text-center">
              <button
                onClick={() => setActiveTab("followers")}
                className="cursor-pointer hover:bg-slate-100/80 transition py-1 border-r border-[#E5E7EB]"
              >
                <div className="text-xl sm:text-2xl font-black text-[#1F2937]">{user?.followersCount}</div>
                <div className="text-xs text-[#6B7280] font-bold mt-0.5 uppercase tracking-wider">Followers</div>
              </button>
              <button
                onClick={() => setActiveTab("following")}
                className="cursor-pointer hover:bg-slate-100/80 transition py-1 border-r border-[#E5E7EB]"
              >
                <div className="text-xl sm:text-2xl font-black text-[#1F2937]">{user?.followingCount}</div>
                <div className="text-xs text-[#6B7280] font-bold mt-0.5 uppercase tracking-wider">Following</div>
              </button>
              <button
                onClick={() => setActiveTab("bookmarks")}
                className="cursor-pointer hover:bg-slate-100/80 transition py-1"
              >
                <div className="text-xl sm:text-2xl font-black text-[#1F2937]">{user?.bookmarksCount}</div>
                <div className="text-xs text-[#6B7280] font-bold mt-0.5 uppercase tracking-wider">Bookmarks</div>
              </button>
            </div>

          </div>

          {/* Tabs Bar (Full Width Segmented Control with Dark Active Button) */}
          <div className="bg-white p-2 rounded-2xl border border-[#E5E7EB] shadow-[0_2px_12px_rgba(16,24,40,0.04)] grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => setActiveTab("posts")}
              className={`py-3 px-4 rounded-xl text-sm font-bold transition-all cursor-pointer text-center ${
                activeTab === "posts"
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F7F8FA]"
              }`}
            >
              Posts ({userPostsLength})
            </button>
            <button
              onClick={() => setActiveTab("followers")}
              className={`py-3 px-4 rounded-xl text-sm font-bold transition-all cursor-pointer text-center ${
                activeTab === "followers"
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F7F8FA]"
              }`}
            >
              Followers
            </button>
            <button
              onClick={() => setActiveTab("following")}
              className={`py-3 px-4 rounded-xl text-sm font-bold transition-all cursor-pointer text-center ${
                activeTab === "following"
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F7F8FA]"
              }`}
            >
              Following
            </button>
            <button
              onClick={() => setActiveTab("bookmarks")}
              className={`py-3 px-4 rounded-xl text-sm font-bold transition-all cursor-pointer text-center ${
                activeTab === "bookmarks"
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F7F8FA]"
              }`}
            >
              Bookmarks
            </button>
          </div>

          {/* Tab Content Feed */}
          <div className="w-full">
            {activeTab === "posts" && (
              <div className="max-w-3xl mx-auto space-y-6">
                <PostCreation />
                {userPosts.length > 0 ? (
                  userPosts.map((post: PostType) => (
                    <div key={post._id} className="transition-transform duration-200 hover:-translate-y-0.5">
                      <PostComponent post={post} isPostDetails={false} />
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-3xl border border-[#E5E7EB] p-20 text-center space-y-3 shadow-[0_4px_24px_rgba(16,24,40,0.04)]">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center mx-auto">
                      <FileText size={26} />
                    </div>
                    <h3 className="text-lg font-bold text-[#1F2937]">No posts yet</h3>
                    <p className="text-sm text-[#6B7280]">Your published thoughts will appear here.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "followers" && (
              <div className="max-w-2xl mx-auto space-y-3">
                <h3 className="text-base font-bold text-[#1F2937] px-2 mb-4">Followers ({user?.followers?.length || user?.followersCount || 0})</h3>
                {console.log("Followers array:", user?.followers)}
                {user?.followers && user.followers.length > 0 ? (
                  user.followers.map((follower: any, idx: number) => {
                    const target = follower?.user || follower?.follower || follower;
                    const id = target?._id || target?.id || (typeof follower === "string" ? follower : idx);
                    const name = target?.name || target?.userName || target?.username || "User";
                    const username = target?.username || target?.userName || target?.name || "user";
                    const photo = target?.photo || target?.image || target?.profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100";
                    const userObj = { _id: id, name, username, photo };

                    return (
                      <div
                        key={id}
                        onClick={() => navigate(`/user/${id}`, { state: { user: userObj } })}
                        className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-xs flex items-center justify-between gap-4 hover:shadow-md transition cursor-pointer"
                      >
                        <div className="flex items-center gap-3.5 overflow-hidden">
                          <img
                            src={photo}
                            alt={name}
                            className="w-12 h-12 rounded-full object-cover shrink-0 border border-slate-200"
                          />
                          <div className="truncate">
                            <h4 className="font-bold text-sm text-[#1F2937] truncate">{name}</h4>
                            <p className="text-xs text-[#6B7280] truncate">@{username}</p>
                          </div>
                        </div>
                        <CheckCircle2 size={16} className="text-slate-900 shrink-0" />
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-white rounded-3xl p-12 text-center border border-[#E5E7EB] shadow-[0_4px_24px_rgba(16,24,40,0.04)]">
                    <p className="text-[#6B7280] font-medium">No followers yet.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "following" && (
              <div className="max-w-2xl mx-auto space-y-3">
                <h3 className="text-base font-bold text-[#1F2937] px-2 mb-4">Following ({user?.following?.length || user?.followingCount || 0})</h3>
                {console.log("Following array:", user?.following)}
                {user?.following && user.following.length > 0 ? (
                  user.following.map((followingUser: any, idx: number) => {
                    const target = followingUser?.user || followingUser?.following || followingUser;
                    const id = target?._id || target?.id || (typeof followingUser === "string" ? followingUser : idx);
                    const name = target?.name || target?.userName || target?.username || "User";
                    const username = target?.username || target?.userName || target?.name || "user";
                    const photo = target?.photo || target?.image || target?.profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100";
                    const userObj = { _id: id, name, username, photo };

                    return (
                      <div
                        key={id}
                        onClick={() => navigate(`/user/${id}`, { state: { user: userObj } })}
                        className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-xs flex items-center justify-between gap-4 hover:shadow-md transition cursor-pointer"
                      >
                        <div className="flex items-center gap-3.5 overflow-hidden">
                          <img
                            src={photo}
                            alt={name}
                            className="w-12 h-12 rounded-full object-cover shrink-0 border border-slate-200"
                          />
                          <div className="truncate">
                            <h4 className="font-bold text-sm text-[#1F2937] truncate">{name}</h4>
                            <p className="text-xs text-[#6B7280] truncate">@{username}</p>
                          </div>
                        </div>
                        <CheckCircle2 size={16} className="text-slate-900 shrink-0" />
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-white rounded-3xl p-12 text-center border border-[#E5E7EB] shadow-[0_4px_24px_rgba(16,24,40,0.04)]">
                    <p className="text-[#6B7280] font-medium">Not following anyone yet.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "bookmarks" && (
              <div className="max-w-3xl mx-auto space-y-6">
                {bookmarkedPosts.length > 0 ? (
                  bookmarkedPosts.map((post: PostType) => (
                    <div key={post._id} className="transition-transform duration-200 hover:-translate-y-0.5">
                      <PostComponent post={post} isPostDetails={false} />
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-3xl border border-[#E5E7EB] p-20 text-center space-y-3 shadow-[0_4px_24px_rgba(16,24,40,0.04)]">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center mx-auto">
                      <Bookmark size={26} />
                    </div>
                    <h3 className="text-lg font-bold text-[#1F2937]">No bookmarks yet</h3>
                    <p className="text-sm text-[#6B7280]">Posts you bookmark will appear right here.</p>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
