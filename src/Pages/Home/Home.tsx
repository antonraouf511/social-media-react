import { useContext, useState } from "react";
import axios from "axios";
import type { Post as PostType } from "../../Types/Posts.Type";
import { PostSkeleton } from "../../Components/Skeleton/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import PostComponent from "../../Components/PostComponent/PostComponent";
import PostCreation from "../../Components/PostCreation/PostCreation";
import { Helmet } from "react-helmet";
import { AuthContext } from "../../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  Home as HomeIcon, Bell, Bookmark, User, Settings,
  TrendingUp, Users, CheckCircle2
} from "lucide-react";
import { useProfile } from "../../Components/Hooks/useProfile";
import type { UserSuggestionType } from "../../Types/suggestion";
import { useUnreadCount } from "../../Components/Hooks/useUnreadCount";
import { useUserPosts } from "../../Components/Hooks/useUserPosts";
import { useFollowUnfollowUser } from "../../Components/Hooks/useFollowUnfollowUser";





export default function Home() {
  const { data: useUnreadCountData } = useUnreadCount();
  const unreadCount = useUnreadCountData?.data?.unreadCount || 0;
  const { userId } = useContext(AuthContext);
  const { data: myPosts } = useUserPosts(userId);
  const navigate = useNavigate();
  const { mutate: followUnfollowUser } = useFollowUnfollowUser();
  const [followingStates, setFollowingStates] = useState<{ [key: string]: boolean }>({
    "1": false,
    "2": false,
    "3": false,
  });
  const { data: profileData } = useProfile();


  //------------------------------------------------- API function to get suggested users
  function getSuggestedUsers() {
    return axios.get("https://route-posts.routemisr.com/users/suggestions?limit=5", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const { data: suggestedUsersData } = useQuery({
    queryKey: ["getSuggestedUsers"],
    queryFn: getSuggestedUsers,
  });

  console.log("Suggested Users Data:", suggestedUsersData?.data?.data?.suggestions);
  const suggestionUsers = (suggestedUsersData?.data?.data?.suggestions || []).slice(0, 5);



  //----------------------------------------------- API function to get all posts
  function getAllPosts() {
    return axios.get("https://route-posts.routemisr.com/posts?sort=-createdAt", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getAllPost"],
    queryFn: getAllPosts,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] py-6 px-4 max-w-3xl mx-auto space-y-6">
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
      </div>
    );
  }
  if (isError) {
    const errorMsg = error instanceof Error ? error.message : "Error loading posts";
    return <div className="text-center py-20 text-rose-500 font-semibold">{errorMsg}</div>;
  }

  const allPosts = data?.data?.data?.posts || [];



  // Trending posts mock data (TODO: wire to API)
  const trendingTopics = [
    { id: "t1", tag: "#WebDevelopment", postsCount: "14.2K posts" },
    { id: "t2", tag: "#DesignSystems", postsCount: "8.5K posts" },
    { id: "t3", tag: "#ReactJS", postsCount: "24.1K posts" },
    { id: "t4", tag: "#TailwindCSS", postsCount: "11.9K posts" },
  ];

  const toggleFollow = (id: string) => {
    followUnfollowUser(id);
    setFollowingStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <Helmet>
        <title>Home — pulse</title>
        <meta name="description" content="Welcome to the Home feed" />
      </Helmet>

      {/* Main Container with 3-Column Desktop Grid */}
      <div className="min-h-screen bg-[#F7F8FA] text-[#1F2937] py-6 font-sans antialiased w-full">
        <div className="w-full px-2 sm:px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)_340px] 2xl:grid-cols-[320px_minmax(0,1fr)_360px] gap-6 lg:gap-8 xl:gap-12 items-start">

          {/* Left Sidebar (Sticky Navigation + Identity) */}
          <aside className="hidden lg:block sticky top-24 space-y-5">

            {/* 1. Mini Profile Card */}
            <div
              onClick={() => navigate("/profile")}
              className="bg-white rounded-3xl border border-[#E5E7EB] shadow-[0_4px_24px_rgba(16,24,40,0.05)] overflow-hidden cursor-pointer hover:shadow-lg transition-all group"
            >
              <div className="h-20 bg-linear-to-r from-slate-900 to-indigo-950 relative">
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
              <div className="px-5 pb-5 pt-0 relative text-center">
                <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-md mx-auto -mt-8 bg-white">
                  <img src={profileData?.photo} alt={profileData?.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                </div>
                <div className="mt-2">
                  <div className="flex items-center justify-center gap-1">
                    <h3 className="font-bold text-sm text-[#1F2937]">{profileData?.name}</h3>
                    <CheckCircle2 size={14} className="text-slate-900" />
                  </div>
                  <p className="text-xs text-[#6B7280]">@{profileData?.username}</p>
                </div>

                <div className="grid grid-cols-3 gap-1 mt-4 pt-4 border-t border-[#E5E7EB] text-center">
                  <div>
                    <div className="text-sm font-bold text-[#1F2937]">{myPosts?.length || 0}</div>
                    <div className="text-[10px] text-[#6B7280] uppercase tracking-wider font-bold">Posts</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#1F2937]">{profileData?.followers?.length || 0}</div>
                    <div className="text-[10px] text-[#6B7280] uppercase tracking-wider font-bold">Followers</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#1F2937]">{profileData?.following?.length || 0}</div>
                    <div className="text-[10px] text-[#6B7280] uppercase tracking-wider font-bold">Following</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Navigation Menu Card */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-[0_4px_24px_rgba(16,24,40,0.05)] p-3 space-y-1">
              <Link to="/" className="flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm shadow-sm transition">
                <HomeIcon size={18} /> Home
              </Link>
              <Link to="/notifications" className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F7F8FA] font-semibold text-sm transition relative">
                <Bell size={18} /> Notifications
                {unreadCount !== 0 && <span className="ml-auto px-1.5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">{unreadCount}</span>}
              </Link>
              <Link to="/profile" state={{ defaultTab: "bookmarks" }} className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F7F8FA] font-semibold text-sm transition">
                <Bookmark size={18} /> Bookmarks
              </Link>
              <Link to="/profile" className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F7F8FA] font-semibold text-sm transition">
                <User size={18} /> Profile
              </Link>
              <Link to="/settings" className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F7F8FA] font-semibold text-sm transition">
                <Settings size={18} /> Settings
              </Link>
            </div>

            {/* 3. Shortcuts Card */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-[0_4px_24px_rgba(16,24,40,0.05)] p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] px-2">Shortcuts</h4>
              <Link to="/profile" className="block px-3 py-2 rounded-xl text-xs font-semibold text-[#1F2937] hover:bg-[#F7F8FA] transition">
                📌 My Posts Feed
              </Link>
              <Link to="/profile" state={{ defaultTab: "bookmarks" }} className="block px-3 py-2 rounded-xl text-xs font-semibold text-[#1F2937] hover:bg-[#F7F8FA] transition">
                🔖 Saved Bookmarks
              </Link>
            </div>

          </aside>

          {/* Center Feed (Composer + Post Cards ~720px) */}
          <main className="w-full max-w-[720px] justify-self-center space-y-6">
            <PostCreation />
            {allPosts.map((post: PostType) => (
              <div key={post._id} className="transition-transform duration-200 hover:-translate-y-0.5 mb-6">
                <PostComponent post={post} isPostDetails={false} />
              </div>
            ))}
          </main>

          {/* Right Sidebar (Discovery: Who to follow + Trending + Footer) */}
          <aside className="hidden xl:block sticky top-24 space-y-5">

            {/* 1. Who to follow */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-[0_4px_24px_rgba(16,24,40,0.05)] p-5 space-y-4">
              <h3 className="text-sm font-bold text-[#1F2937] flex items-center gap-2">
                <Users size={16} className="text-slate-900" /> Who to follow
              </h3>

              <div className="space-y-3.5">
                {suggestionUsers.map((user: UserSuggestionType) => {
                  const isFollowing = followingStates[user._id];
                  return (
                    <div key={user._id} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img src={user.photo} alt={user.name} className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200" />
                        <div className="truncate">
                          <h4 className="text-xs font-bold text-[#1F2937] truncate">{user.name}</h4>
                          <p className="text-[11px] text-[#6B7280] truncate">{user.username}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleFollow(user._id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                          isFollowing
                            ? "bg-slate-100 text-[#1F2937] hover:bg-slate-200"
                            : "bg-slate-900 text-white hover:bg-black shadow-xs"
                        }`}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </button>
                    </div>
                  );
                })}
              </div>

              <Link to="/suggestions" className="block w-full pt-2 text-xs font-bold text-slate-900 hover:underline text-left cursor-pointer">
                Show more suggestions
              </Link>
            </div>

            {/* 2. Trending / Popular Tags */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-[0_4px_24px_rgba(16,24,40,0.05)] p-5 space-y-4">
              <h3 className="text-sm font-bold text-[#1F2937] flex items-center gap-2">
                <TrendingUp size={16} className="text-slate-900" /> Trending Topics
              </h3>

              <div className="space-y-3">
                {trendingTopics.map((topic) => (
                  <div key={topic.id} className="cursor-pointer group">
                    <span className="text-[11px] text-[#6B7280] font-medium">Trending worldwide</span>
                    <h4 className="text-xs font-bold text-[#1F2937] group-hover:text-blue-600 transition">{topic.tag}</h4>
                    <span className="text-[11px] text-[#6B7280] font-medium">{topic.postsCount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Small Footer */}
            <div className="px-3 text-[11px] text-[#6B7280] space-y-2">
              <div className="flex flex-wrap gap-x-3 gap-y-1 font-medium">
                <Link to="#" className="hover:underline">About</Link>
                <Link to="#" className="hover:underline">Privacy</Link>
                <Link to="#" className="hover:underline">Terms</Link>
                <Link to="#" className="hover:underline">Help</Link>
              </div>
              <p>© 2026 pulse. All rights reserved.</p>
            </div>

          </aside>

        </div>
      </div>
    </>
  );
}
