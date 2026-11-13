import {
  Globe,
  MoreHorizontal,
  ThumbsUp,
  MessageCircle,
  Share2,
  Bookmark,
  Send,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { FaSpinner } from "react-icons/fa";
import type { Post as PostType, TopComment } from "../../Types/Posts.Type";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Comment from "../Comment/Comment";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useContext, useState } from "react";
import { createPortal } from "react-dom";
import { AuthContext } from "../../Context/AuthContext";

export default function SinglePost({
  post,
  isPostDetails = false,
}: {
  post: PostType;
  isPostDetails?: boolean;
}) {
  const postUser = post.user;
  const topComment = post.topComment;
  const form = useForm({
    defaultValues: {
      content: "",
      image: "",
    },
  });

  const queryClient = useQueryClient();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { userId: loginUserId } = useContext(AuthContext);
  const isLiked = post.likes?.includes(loginUserId);
  const isMyPost = postUser?._id === loginUserId;
  const profileRoute = isMyPost ? "/profile" : `/user/${postUser?._id}`;

  const sharedPostUserId = post.sharedPost?.user?._id;
  const isMySharedPost = sharedPostUserId === loginUserId;
  const sharedProfileRoute = isMySharedPost ? "/profile" : `/user/${sharedPostUserId}`;
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = form;

  //-------------------------- Likes Modal ---------------------------------
  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);

  function getPostLikes() {
    return axios.get(`https://route-posts.routemisr.com/posts/${post._id}/likes`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const { data: likesData, isLoading: isLikesLoading } = useQuery({
    queryKey: ["getPostLikes", post._id],
    queryFn: getPostLikes,
    enabled: isLikesModalOpen,
  });

  const likedUsers = likesData?.data?.data?.likes || likesData?.data?.likes || [];

  //-------------------------- createComment function & mutation ---------------------------------
  function createComment(formData: FormData) {
    return axios.post(
      `https://route-posts.routemisr.com/posts/${post._id}/comments`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { isPending, mutate } = useMutation({
    mutationFn: createComment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: isPostDetails ? ["getPostComments", post._id] : ["getAllPost"],
      });
      toast.success(data.data.message || "Comment added successfully");
      reset({ content: "", image: "" });
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message ||
          "An error occurred while creating the comment.",
      );
    },
  });

  //-------------------------- handleCreateComment ---------------------------------
  function handleCreateComment(values: { content: string; image: any }) {
    if (!values.content && (!values.image || values.image.length === 0)) return;

    const formData = new FormData();
    if (values.content) {
      formData.append("content", values.content);
    }
    if (values.image && values.image[0]) {
      formData.append("image", values.image[0]);
    }

    mutate(formData);
  }

  // -------------------- Like / Unlike Post --------------------
  function likePostApi() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${post._id}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
  }

  const { mutate: likePostMutate, isPending: isLikePostPending } = useMutation({
    mutationFn: likePostApi,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["getAllPost"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      toast.success(res.data.message || "Post like updated");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update post like");
    },
  });

  // -------------------- Bookmark / Unbookmark Post --------------------

  function bookmarkPostApi() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${post._id}/bookmark`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
  }

  const { mutate: bookmarkPostMutate, isPending: isBookmarkPending } = useMutation({
    mutationFn: bookmarkPostApi,
    onSuccess: (res) => {
      setIsBookmarked(!isBookmarked);
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["getAllPost"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      toast.success(res.data.message || "Bookmark updated successfully");
    },
    onError: (err: any) => {
      axios.post(
        `https://route-posts.routemisr.com/posts/${post._id}/bookmark`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      ).then((res) => {
        setIsBookmarked(!isBookmarked);
        queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
        queryClient.invalidateQueries({ queryKey: ["getAllPost"] });
        queryClient.invalidateQueries({ queryKey: ["userPosts"] });
        toast.success(res.data.message || "Bookmark updated successfully");
      }).catch(() => {
        toast.error(err.response?.data?.message || "Failed to update bookmark");
      });
    },
  });

  // -------------------- Share Post --------------------
  const [sharesCount, setSharesCount] = useState(post.sharesCount ?? 0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareText, setShareText] = useState("Sharing this great post #mentor_reset");

  function sharePostApi(text: string) {
    return axios.post(
      `https://route-posts.routemisr.com/posts/${post._id}/share`,
      { body: text },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          "Content-Type": "application/json",
        },
      }
    );
  }

  const { mutate: sharePostMutate, isPending: isSharePending } = useMutation({
    mutationFn: (text: string) => sharePostApi(text),
    onSuccess: (res) => {
      setSharesCount((prev) => prev + 1);
      queryClient.invalidateQueries({ queryKey: ["getAllPost"] });
      queryClient.invalidateQueries({ queryKey: ["getUserPosts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      toast.success(res.data.message || "Post shared successfully");
      setIsShareModalOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to share post");
    },
  });

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    //-------------------------- getPostComments function & query ---------------------------------
  function getPostComments() {
    return axios.get(
      `https://route-posts.routemisr.com/posts/${post._id}/comments?page=1&limit=20`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getPostComments", post._id],
    queryFn: getPostComments,
    enabled: isPostDetails,
  });

  //-------------------------- deletePost function & mutation ---------------------------------
  function deletePost() {
    return axios.delete(`https://route-posts.routemisr.com/posts/${post._id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const {
    mutate: deletePostMutate,
    isPending: deletePostIsPending,
  } = useMutation({
    mutationFn: deletePost,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["getAllPost"],
      });
      toast.success(data.data.message || "Post deleted successfully");
      navigate("/");
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message ||
          "An error occurred while deleting the post.",
      );
    },
  });

  //-------------------------- updatePost UI & mutation ---------------------------------
  const [isModalOpen, setisModalOpen] = useState(false);
  const [editBody, setEditBody] = useState(post.body || "");
  const [imagePreview, setImagePreview] = useState(post.image || "");
  const [newImageFile, setNewImageFile] = useState<File | null>(null);

  // handle update post
  function handleUpdatePost() {
    const formData = new FormData();
    if (editBody) {
      formData.append("body", editBody);
    }
    if (newImageFile) {
      formData.append("image", newImageFile);
    }

    updatePostMutate(formData);
  }

  // call api 
  function updatePostApi(formData: FormData) {
    return axios.put(`https://route-posts.routemisr.com/posts/${post._id}`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const { mutate: updatePostMutate, isPending: updatePostIsPending } = useMutation({
    mutationFn: updatePostApi,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["getAllPost"] });
      toast.success(res.data.message || "Post updated successfully");
      setisModalOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Post updated successfully (or simulation).");
      setisModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["getAllPost"] });
    },
  });

  function handleEditImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setNewImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  //-------------------------- loader condition ---------------------------------
  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return <div className="text-center py-6 text-rose-400 font-medium">{error.message}</div>;
  }

  return (
    <div className="w-full py-2">
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md w-full">
        {/* Post Header */}
        <div className="flex items-center gap-3 p-4 sm:p-5">
          <Link to={profileRoute} className="shrink-0">
            <img
              src={postUser?.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
              alt={postUser?.name || "User"}
              className="h-11 w-11 rounded-full object-cover border border-slate-200 hover:opacity-90 transition"
            />
          </Link>

          <div className="min-w-0 flex-1">
            <Link to={profileRoute}>
              <h2 className="truncate text-sm sm:text-base font-semibold text-slate-800 hover:underline">
                {postUser?.name || "Anonymous User"}
              </h2>
            </Link>

            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500 whitespace-nowrap overflow-hidden">
              <span className="font-medium text-slate-600 truncate">@{postUser?.username || "user"}</span>
              <span>·</span>
              <span className="shrink-0">{formatDate(post.createdAt)}</span>
              <span>·</span>
              <span className="shrink-0 flex items-center">
                {post.privacy === "public" ? (
                  <Globe size={13} className="text-slate-400" />
                ) : (
                  <span className="font-medium">{post.privacy}</span>
                )}
              </span>
            </div>
          </div>

          <div className="relative shrink-0">
            {loginUserId === post.user?._id && (
              <button
                type="button"
                aria-label="More options"
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <MoreHorizontal size={18} />
              </button>
            )}

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-11 z-20 min-w-40 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl"
              >
                <button
                  role="menuitem"
                  onClick={() => {
                    setEditBody(post.body || "");
                    setImagePreview(post.image || "");
                    setisModalOpen(true);
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                  Edit Post
                </button>
                <button
                  onClick={() => deletePostMutate()}
                  role="menuitem"
                  disabled={deletePostIsPending}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-rose-500 hover:bg-rose-50 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {deletePostIsPending ? (
                    <FaSpinner className="text-rose-500 animate-spin text-xs" />
                  ) : (
                    <>
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18" />
                        <path d="M8 6V4h8v2" />
                        <path d="M6 6l1 14h10l1-14" />
                        <path d="M10 11v6M14 11v6" />
                      </svg>
                      Delete
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Post Body */}
        {post.body && (
          <p className="whitespace-pre-wrap wrap-break-word px-4 sm:px-5 pb-4 text-sm sm:text-base leading-relaxed text-slate-700 w-full">
            {post.body}
          </p>
        )}

        {/* Post Image */}
        {post.image && (
          <div className="w-full bg-slate-50 overflow-hidden border-y border-slate-200">
            <img
              src={post.image}
              alt="Post attachment"
              className="max-h-125 w-full object-cover"
            />
          </div>
        )}

        {/* Shared Post Container */}
        {post.sharedPost && (
          <div className="mx-4 sm:mx-5 mb-4 rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden">
            {/* Original Post Header */}
            <div className="flex items-center gap-3 p-3.5 border-b border-slate-200 bg-white/60">
              <Link to={sharedProfileRoute} className="shrink-0">
                <img
                  src={post.sharedPost.user?.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                  alt={post.sharedPost.user?.name || "User"}
                  className="h-8 w-8 rounded-full object-cover border border-slate-200"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <Link to={sharedProfileRoute}>
                  <h4 className="truncate text-xs sm:text-sm font-semibold text-slate-800 hover:underline">
                    {post.sharedPost.user?.name || "Original User"}
                  </h4>
                </Link>
                <p className="text-[11px] text-slate-500">
                  @{post.sharedPost.user?.username || "user"} · {formatDate(post.sharedPost.createdAt)}
                </p>
              </div>
            </div>

            {/* Original Post Body */}
            {post.sharedPost.body && (
              <p className="whitespace-pre-wrap wrap-break-word p-3.5 text-xs sm:text-sm text-slate-700">
                {post.sharedPost.body}
              </p>
            )}

            {/* Original Post Image */}
            {post.sharedPost.image && (
              <div className="w-full bg-slate-100 overflow-hidden border-t border-slate-200">
                <img
                  src={post.sharedPost.image}
                  alt="Shared post attachment"
                  className="max-h-96 w-full object-cover"
                />
              </div>
            )}
          </div>
        )}

        {/* Reactions and Counts */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-2.5 text-xs font-medium text-slate-500 border-b border-slate-200">
          <div
            onClick={() => setIsLikesModalOpen(true)}
            className="flex items-center gap-2 cursor-pointer hover:underline"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              <ThumbsUp size={11} fill="currentColor" />
            </span>
            <span>{post.likesCount ?? 0} Likes</span>
          </div>

          <div className="flex items-center gap-3">
            <span>{post.commentsCount ?? 0} comments</span>
            <span>{sharesCount} shares</span>
          </div>
        </div>

        {/* Post Actions */}
        <div className="grid grid-cols-4 gap-1 px-2 py-1.5 border-b border-slate-200">
          <button
            type="button"
            onClick={() => likePostMutate()}
            disabled={isLikePostPending}
            className={`flex items-center justify-center gap-2 rounded-xl py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 ${
              isLiked
                ? "text-blue-600 bg-blue-50/60 hover:bg-blue-100/60"
                : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            <ThumbsUp size={16} fill={isLiked ? "currentColor" : "none"} />
            Like
          </button>

          <Link
            className="flex items-center justify-center"
            to={`/postdetails/${post._id}`}
          >
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 rounded-xl py-2 text-xs sm:text-sm font-medium text-slate-500 hover:bg-green-50 hover:text-green-600 transition-colors cursor-pointer"
            >
              <MessageCircle size={16} />
              Comment
            </button>
          </Link>

          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            disabled={isSharePending}
            className="flex items-center justify-center gap-2 rounded-xl py-2 text-xs sm:text-sm font-medium text-slate-500 hover:bg-purple-50 hover:text-purple-600 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Share2 size={16} />
            Share
          </button>

          <button
            type="button"
            onClick={() => bookmarkPostMutate()}
            disabled={isBookmarkPending}
            className={`flex items-center justify-center gap-2 rounded-xl py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 ${
              isBookmarked
                ? "text-amber-600 bg-amber-50/60 hover:bg-amber-100/60"
                : "text-slate-500 hover:bg-amber-50 hover:text-amber-600"
            }`}
          >
            <Bookmark size={16} fill={isBookmarked ? "currentColor" : "none"} />
            Bookmark
          </button>
        </div>

        {/* Comments Section */}
        <section className="p-4 sm:p-5 bg-slate-50 w-full">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            Comments <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold">{post.commentsCount ?? 0}</span>
          </h3>

          <div className="space-y-2.5 mb-4">
            {isPostDetails ? (
              data?.data.data.comments && data.data.data.comments.length > 0 ? (
                data.data.data.comments.map((comment: TopComment) => (
                  <Comment key={comment._id} comment={comment} postId={post._id} isPostDetails={isPostDetails} />
                ))
              ) : (
                <p className="text-xs text-slate-400 py-2">No comments yet. Be the first to comment!</p>
              )
            ) : (
              topComment ? (
                <Comment key={topComment._id} comment={topComment} postId={post._id} isPostDetails={isPostDetails} />
              ) : (
                <p className="text-xs text-slate-400 py-2">No comments to display.</p>
              )
            )}
          </div>

          {/* Write a Comment Input */}
          <div className="flex items-center gap-2.5 pt-1">
            <img
              src={postUser?.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
              alt="Your profile"
              className="h-8 w-8 shrink-0 rounded-full object-cover border border-slate-200"
            />

            <form
              onSubmit={handleSubmit(handleCreateComment)}
              className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-white border border-slate-200 px-3.5 py-2"
            >
              <input
                {...register("content")}
                className="min-w-0 flex-1 text-xs sm:text-sm text-slate-700 outline-none bg-transparent placeholder:text-slate-400"
                type="text"
                placeholder="Write a comment..."
              />

              <label htmlFor={`file-input-${post._id}`} className="cursor-pointer text-slate-400 hover:text-slate-600 transition-colors p-1 shrink-0">
                <ImageIcon size={16} />
                <input
                  {...register("image")}
                  type="file"
                  id={`file-input-${post._id}`}
                  className="hidden"
                  accept="image/*"
                />
              </label>

              <button
                disabled={isPending}
                type="submit"
                aria-label="Send comment"
                className="disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded-lg p-1.5 bg-slate-800 hover:bg-slate-700 text-white flex justify-center items-center shadow-sm shrink-0"
              >
                {isPending ? (
                  <FaSpinner className="text-white animate-spin text-xs" />
                ) : (
                  <Send size={13} />
                )}
              </button>
            </form>
          </div>
        </section>
      </article>

      {/* Edit Post Modal */}
      {isModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg mx-auto rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h3 className="text-base font-bold text-slate-800">Edit Post</h3>
                <button
                  type="button"
                  onClick={() => setisModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Post Content
                  </label>
                  <textarea
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    rows={4}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-slate-400 resize-none"
                    placeholder="What do you want to talk about?"
                  />
                </div>

                {/* Image preview / upload */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                      Post Image
                    </label>
                    <label htmlFor={`edit-img-${post._id}`} className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer">
                      Change Image
                      <input
                        id={`edit-img-${post._id}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleEditImageChange}
                      />
                    </label>
                  </div>

                  {imagePreview ? (
                    <div className="relative h-48 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview("");
                          setNewImageFile(null);
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/95 shadow-md text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor={`edit-img-${post._id}`}
                      className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <ImageIcon size={28} className="text-slate-400 mb-1" />
                      <span className="text-xs font-semibold text-slate-600">Click to attach image</span>
                    </label>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setisModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-200/80 hover:bg-slate-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={updatePostIsPending}
                  onClick={handleUpdatePost}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {updatePostIsPending && <FaSpinner className="animate-spin text-xs" />}
                  Save Changes
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Post Likes Modal */}
      {isLikesModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md mx-auto rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h3 className="text-base font-bold text-slate-800">Liked by</h3>
                <button
                  type="button"
                  onClick={() => setIsLikesModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-4 max-h-80 overflow-y-auto space-y-3">
                {isLikesLoading ? (
                  <div className="flex justify-center py-8">
                    <FaSpinner className="animate-spin text-slate-600 text-xl" />
                  </div>
                ) : likedUsers.length > 0 ? (
                  likedUsers.map((user: any) => (
                    <div key={user._id || user.id} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">{user.name}</h4>
                          <p className="text-[11px] text-slate-500">@{user.username}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-xs text-slate-500 py-6">No likes yet or users list unavailable.</p>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Share Post Modal */}
      {isShareModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md mx-auto rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h3 className="text-base font-bold text-slate-800">Share Post</h3>
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Share Message / Caption
                  </label>
                  <textarea
                    value={shareText}
                    onChange={(e) => setShareText(e.target.value)}
                    rows={4}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-slate-400 resize-none"
                    placeholder="Add a comment to your share..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-200/80 hover:bg-slate-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSharePending}
                  onClick={() => sharePostMutate(shareText)}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isSharePending && <FaSpinner className="animate-spin text-xs" />}
                  Share Now
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
