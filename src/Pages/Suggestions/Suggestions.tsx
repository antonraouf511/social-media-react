import { useState } from "react";
import { Helmet } from "react-helmet";
import { Users, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SuggestionSkeleton } from "../../Components/Skeleton/PostSkeleton";
import type { UserSuggestionType } from "../../Types/suggestion";
import { useFollowUnfollowUser } from "../../Components/Hooks/useFollowUnfollowUser";

export default function Suggestions() {
  const navigate = useNavigate();
  const [followingStates, setFollowingStates] = useState<{ [key: string]: boolean }>({});
  const { mutate: followUnfollowUser } = useFollowUnfollowUser();



  function getAllSuggestions() {
    return axios.get("https://route-posts.routemisr.com/users/suggestions?limit=50", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["allSuggestionsPage"],
    queryFn: getAllSuggestions,
  });

  const suggestions: UserSuggestionType[] = data?.data?.data?.suggestions || [];

  const toggleFollow = (id: string) => {
    followUnfollowUser(id);
    setFollowingStates(prev => {
      const nextState = !prev[id];
      return { ...prev, [id]: nextState };
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] py-8 px-4 sm:px-8 max-w-4xl mx-auto space-y-4">
        <SuggestionSkeleton />
        <SuggestionSkeleton />
        <SuggestionSkeleton />
        <SuggestionSkeleton />
      </div>
    );
  }
  if (isError) {
    const errorMsg = error instanceof Error ? error.message : "Failed to load suggestions";
    return <div className="text-center py-20 text-rose-500 font-semibold">{errorMsg}</div>;
  }

  return (
    <>
      <Helmet>
        <title>Discover People — pulse</title>
        <meta name="description" content="Explore people and follow suggestions." />
      </Helmet>

      <div className="min-h-screen bg-[#F7F8FA] text-[#1F2937] py-8 px-4 sm:px-8 lg:px-12 font-sans antialiased w-full">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Header Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E7EB] shadow-[0_4px_24px_rgba(16,24,40,0.05)] flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition cursor-pointer"
                title="Go back"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2937] flex items-center gap-3">
                  <Users className="text-slate-900" size={28} /> Discover People
                </h1>
                <p className="text-sm text-[#6B7280] mt-1">
                  Connect with creators, developers, and industry peers recommended for you.
                </p>
              </div>
            </div>
            <div className="text-xs font-bold bg-slate-100 px-3 py-1.5 rounded-xl text-slate-700 hidden sm:block">
              {suggestions.length} Suggestions
            </div>
          </div>

          {/* Suggestions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map((user) => {
              const isFollowing = followingStates[user._id];
              return (
                <div
                  key={user._id}
                  className="bg-white rounded-3xl p-5 border border-[#E5E7EB] shadow-[0_4px_24px_rgba(16,24,40,0.05)] flex items-center justify-between gap-4 hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3.5 overflow-hidden">
                    <img
                      src={user.photo}
                      alt={user.name}
                      className="w-14 h-14 rounded-full object-cover shrink-0 border-2 border-slate-100 shadow-sm"
                    />
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-[#1F2937] truncate">{user.name}</h4>
                        <CheckCircle2 size={14} className="text-slate-900 shrink-0" />
                      </div>
                      <p className="text-xs text-[#6B7280] truncate">@{user.username}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-[#6B7280]">
                        <span>{user.followersCount || 142} followers</span>
                        {user.mutualFollowersCount > 0 && (
                          <span>• {user.mutualFollowersCount} mutual</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFollow(user._id)}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer shrink-0 shadow-xs ${
                      isFollowing
                        ? "bg-slate-100 text-[#1F2937] hover:bg-slate-200"
                        : "bg-slate-900 text-white hover:bg-black"
                    }`}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                </div>
              );
            })}
          </div>

          {suggestions.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#E5E7EB]">
              <p className="text-[#6B7280] font-medium">No suggestions available at the moment.</p>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
