import { useState, useContext } from "react";
import { type TopComment } from "./../../Types/Posts.Type";
import { MoreHorizontal, Edit3, Trash2, X, Send } from "lucide-react";
import { createPortal } from "react-dom";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";
import { AuthContext } from "../../Context/AuthContext";


export default function Comment({
  comment,
  postId,
  isPostDetails = false,
}: {
  comment: TopComment;
  postId: string;
  isPostDetails?: boolean;
}) {
  const { commentCreator, content, createdAt, image, _id } = comment;
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [editbody, seteditbody] = useState(comment.content || "");
  const [ImagePreview, setImagePreview] = useState(comment.image || "");
  const [newImageFile, setNewImageFile] = useState<File | null>(null);

  const queryClient = useQueryClient();
  const { userId: loginUserId } = useContext(AuthContext);
  const isCommentLiked = comment.likes?.includes(loginUserId);

  function deleteComment() {
    return axios.delete(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${_id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { reset, mutate } = useMutation({
    mutationFn: deleteComment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["getPostComments", postId],
      });
      queryClient.invalidateQueries({
        queryKey: ["getSinglePost", postId],
      });
      queryClient.invalidateQueries({
        queryKey: ["getAllPost"],
      });
      toast.success(data.data.message || "Comment deleted successfully");
      reset();
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message ||
          "Failed to delete comment. Please try again.",
      );
    },
  });

  // -------------------- like / unlike comment --------------------
  function likeCommentApi() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${_id}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
  }

  const { mutate: likeCommentMutate } = useMutation({
    mutationFn: likeCommentApi,
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: isPostDetails ? ["getPostComments", postId] : ["getAllPost"],
      });
      toast.success(res.data.message || "Comment reaction updated");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to react to comment");
    },
  });

  // -------------------- Replies --------------------
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [showReplies, setShowReplies] = useState(false);

  function getCommentReplies() {
    return axios.get(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${_id}/replies`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
  }

  const { data: repliesData, isLoading: isRepliesLoading } = useQuery({
    queryKey: ["getCommentReplies", _id],
    queryFn: getCommentReplies,
    enabled: showReplies,
  });

  const replies = repliesData?.data?.data?.replies || repliesData?.data?.replies || [];

  function createReplyApi(formData: FormData) {
    return axios.post(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${_id}/replies`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
  }

  const { mutate: createReplyMutate, isPending: isReplyPending } = useMutation({
    mutationFn: createReplyApi,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["getCommentReplies", _id] });
      queryClient.invalidateQueries({ queryKey: ["getPostComments", postId] });
      toast.success(res.data.message || "Reply added successfully");
      setReplyContent("");
      setShowReplyInput(false);
      setShowReplies(true);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to add reply");
    },
  });

  function handleCreateReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyContent.trim()) return;
    const formData = new FormData();
    formData.append("content", replyContent);
    createReplyMutate(formData);
  }

  // -------------------- handle edit comment --------------------
  function handleUpdateComment() {
    const formData = new FormData();
    if (editbody) {
      formData.append("content", editbody);
    }
    if (newImageFile) {
      formData.append("image", newImageFile);
    }
    updateCommentMutate(formData);
  }
  // call Api
  function updateCommentApi(formData: FormData) {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }
  const {
    isPending,
    mutate: updateCommentMutate,
  } = useMutation({
    mutationFn: updateCommentApi,
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: isPostDetails ? ["getPostComments", postId] : ["getAllPost"],
      });
      toast.success(res?.data.message || "Comment updated successfully");
      setisModalOpen(false);
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message ||
          "Failed to update comment. Please try again.",
      );
    },
  });

  function handleEditImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setNewImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  return (
    <div className="py-1.5 group">
      <div className="flex items-start gap-2.5">
        {commentCreator?.photo && (
          <img
            src={commentCreator.photo}
            alt={commentCreator.name || "User"}
            className="h-7 w-7 shrink-0 rounded-full object-cover border border-slate-200"
          />
        )}

        <div className="min-w-0 flex-1">
          {/* Comment Bubble Container with relative positioning */}
          <div className="relative inline-block max-w-full w-full rounded-xl bg-slate-100 border border-slate-200 px-3.5 py-2.5 pr-9">
            <p className="text-xs font-semibold text-slate-800">
              {commentCreator?.name}
            </p>

            <p className="mt-1 mb-1.5 whitespace-pre-wrap wrap-break-word text-xs sm:text-sm leading-relaxed text-slate-600">
              {content}
            </p>

            {image && (
              <img
                src={image}
                alt="Comment attachment"
                className="mt-2 rounded-lg max-h-48 w-full object-cover border border-slate-200"
              />
            )}

            {/* Comment Options Dropdown inside bubble */}
            <div className="absolute top-2.5 right-2.5">
              <button
                type="button"
                aria-label="Comment options"
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition-colors cursor-pointer"
              >
                <MoreHorizontal size={15} />
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-7 z-20 min-w-36 rounded-xl border border-slate-200 bg-white p-1 shadow-xl animate-in fade-in zoom-in-95 duration-150"
                >
                  <button
                    role="menuitem"
                    onClick={() => {
                      seteditbody(comment.content || "");
                      setImagePreview(comment.image || "");
                      setisModalOpen(true);
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    <Edit3 size={14} className="text-slate-500" />
                    Edit
                  </button>

                  <button
                    role="menuitem"
                    onClick={() => mutate()}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 size={14} className="text-rose-500" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-1 flex items-center gap-2.5 px-1 text-[11px] font-medium text-slate-400">
            {/* like button */}
            <button
              type="button"
              onClick={() => likeCommentMutate()}
              className={`transition hover:text-blue-500 hover:underline cursor-pointer font-semibold ${
                isCommentLiked ? "text-blue-600 font-bold" : "text-slate-400"
              }`}
            >
              Like ({comment.likes?.length || 0})
            </button>

            <span>·</span>

            {/* reply button */}
            <button
              type="button"
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="transition hover:text-green-500 hover:underline cursor-pointer"
            >
              Reply
            </button>

            <span>·</span>

            <span className="text-slate-400">
              {new Date(createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Reply Input Form */}
          {showReplyInput && (
            <form onSubmit={handleCreateReply} className="mt-2.5 flex items-center gap-2">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-slate-400"
              />
              <button
                type="submit"
                disabled={isReplyPending}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs flex items-center justify-center cursor-pointer disabled:opacity-50"
              >
                {isReplyPending ? <FaSpinner className="animate-spin text-xs" /> : <Send size={12} />}
              </button>
            </form>
          )}

          {/* View / Hide Replies Toggle */}
          <div className="mt-2">
            <button
              type="button"
              onClick={() => setShowReplies(!showReplies)}
              className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              {showReplies ? "Hide replies" : "View replies"}
            </button>

            {showReplies && (
              <div className="mt-2 pl-4 border-l-2 border-slate-200 space-y-2">
                {isRepliesLoading ? (
                  <div className="py-2 text-xs text-slate-400">Loading replies...</div>
                ) : replies.length > 0 ? (
                  replies.map((reply: any) => (
                    <div key={reply._id} className="flex items-start gap-2 text-xs">
                      <img
                        src={reply.commentCreator?.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                        alt={reply.commentCreator?.name}
                        className="w-6 h-6 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 flex-1">
                        <span className="font-bold text-slate-800">{reply.commentCreator?.name}</span>
                        <p className="text-slate-600 mt-0.5">{reply.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-[11px] text-slate-400 py-1">No replies yet.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Comment Modal */}
      {isModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg mx-auto rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h3 className="text-base font-bold text-slate-800">
                  Edit Comment
                </h3>
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
                    Comment Content
                  </label>
                  <textarea
                    value={editbody}
                    onChange={(e) => seteditbody(e.target.value)}
                    rows={4}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-slate-400 resize-none"
                    placeholder="Write a comment..."
                  />
                </div>

                {/* Image preview / upload */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                      Comment Image
                    </label>
                    <label
                      htmlFor={`edit-img-comment-${_id}`}
                      className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                    >
                      Change Image
                      <input
                        id={`edit-img-comment-${_id}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleEditImageChange}
                      />
                    </label>
                  </div>

                  {ImagePreview ? (
                    <div className="relative h-48 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                      <img
                        src={ImagePreview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(comment.image || "");
                          setNewImageFile(null);
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setisModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateComment}
                  disabled={isPending}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer"
                >
                  {isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
