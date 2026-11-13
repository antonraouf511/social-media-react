import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PostSkeleton, ProfileSkeleton } from "../../Components/Skeleton/PostSkeleton";
import PostComponent from "../../Components/PostComponent/PostComponent";
import type { Post as PostType } from "../../Types/Posts.Type";
import { ArrowLeft, CheckCircle2, UserPlus, UserCheck, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { useFollowUnfollowUser } from "../../Components/Hooks/useFollowUnfollowUser";
import { useProfile } from "../../Components/Hooks/useProfile";

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const passedUser = location.state?.user;
  const { mutate: followUnfollowUser, isPending: isFollowingPending } = useFollowUnfollowUser();
  const { data: myProfile } = useProfile();
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (myProfile?.following && id) {
      const isAlreadyFollowing = myProfile.following.some(
        (f: any) => (typeof f === "string" ? f === id : f._id === id)
      );
      setIsFollowing(isAlreadyFollowing);
    }
  }, [myProfile, id]);

  // Get user posts (Nested)
  function getUserPosts() {
    return axios.get(`https://route-posts.routemisr.com/users/${id}/posts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const { data: postsData, isLoading: isPostsLoading, isError } = useQuery({
    queryKey: ["userPosts", id],
    queryFn: getUserPosts,
    enabled: !!id,
  });

  const userPosts: PostType[] = postsData?.data?.data?.posts || postsData?.data?.posts || [];
  const profileUser = passedUser || userPosts[0]?.user || { name: "User", username: "user", photo: "" };
  console.log("Profile User:", profileUser);

  if (isPostsLoading) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] py-8 px-4 sm:px-8 max-w-4xl mx-auto space-y-6">
        <ProfileSkeleton />
        <PostSkeleton />
      </div>
    );
  }
  if (isError) {
    return <div className="text-center py-20 text-rose-500 font-semibold">Failed to load user posts.</div>;
  }

  const toggleFollow = () => {
    setIsFollowing(prev => !prev);
  };

  return (
    <>
      <Helmet>
        <title>{profileUser?.name || "User"} — Profile | pulse</title>
        <meta name="description" content="View user profile and posts." />
      </Helmet>

      <div className="min-h-screen bg-[#F7F8FA] text-[#1F2937] pb-24 font-sans antialiased w-full">
        <div className="w-full px-4 sm:px-8 lg:px-12 pt-6 space-y-8">

          {/* Back button header */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-2xl bg-white border border-[#E5E7EB] hover:bg-slate-50 flex items-center justify-center text-slate-700 transition cursor-pointer shadow-xs"
              title="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-[#1F2937]">Profile Details</h1>
          </div>

          {/* Profile Header Card */}
          <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(16,24,40,0.06)] border border-[#E5E7EB] overflow-hidden">
            <div className="relative h-64 sm:h-80 w-full bg-linear-to-r from-slate-900 via-slate-800 to-indigo-950 overflow-hidden">
              <div className="absolute inset-0 bg-black/20"></div>
            </div>

            <div className="px-6 sm:px-10 pb-8 pt-0 relative">
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between -mt-16 sm:-mt-20 mb-6 gap-4">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white shadow-[0_6px_20px_rgba(16,24,40,0.12)] bg-white">
                  <img
                    src={profileUser?.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"}
                    alt={profileUser?.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <button
                  onClick={() => {
                    followUnfollowUser(profileUser?._id);
                    toggleFollow();
                  }}
                  disabled={isFollowingPending}
                  className={`px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition cursor-pointer flex items-center gap-2 ${
                    isFollowing
                      ? "bg-slate-100 text-[#1F2937] hover:bg-slate-200"
                      : "bg-slate-900 text-white hover:bg-black"
                  }`}
                >
                  {isFollowing ? <><UserCheck size={16} /> Following</> : <><UserPlus size={16} /> Follow</>}
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1F2937]">{profileUser?.name}</h2>
                  <CheckCircle2 size={20} className="text-slate-900" />
                </div>
                <p className="text-sm text-[#6B7280] font-medium">@{profileUser?.username || "user"}</p>
              </div>

              <p className="text-sm sm:text-base text-[#1F2937] font-normal leading-relaxed mt-4 max-w-2xl">
                Passionate creator and developer sharing updates and moments.
              </p>

              <div className="flex flex-wrap items-center gap-6 mt-5 pt-5 border-t border-[#E5E7EB] text-xs sm:text-sm text-[#6B7280]">
                <span className="flex items-center gap-2">
                  <MapPin size={16} className="text-slate-800" /> Cairo, Egypt
                </span>
                <div className="flex gap-4">
                  <span><strong className="text-slate-900">1.2K</strong> Followers</span>
                  <span><strong className="text-slate-900">340</strong> Following</span>
                  <span><strong className="text-slate-900">{userPosts.length}</strong> Posts</span>
                </div>
              </div>
            </div>
          </div>

          {/* User Posts Section */}
          <div className="max-w-3xl mx-auto space-y-6">
            <h3 className="text-lg font-bold text-[#1F2937] px-2">Posts by {profileUser?.name}</h3>
            {userPosts.length > 0 ? (
              userPosts.map((post: PostType) => (
                <div key={post._id} className="transition-transform duration-200 hover:-translate-y-0.5">
                  <PostComponent post={post} isPostDetails={false} />
                </div>
              ))
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#E5E7EB]">
                <p className="text-[#6B7280] font-medium">No posts published yet.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
