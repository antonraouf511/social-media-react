import { Image as ImageIcon, X, Pencil, PlusSquare, Send } from "lucide-react";
import cat from "../../assets/baby-groot-guardians.jpg";
import { useRef, useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";

export default function PostCreation() {
  const [isUploaded, setisUploaded] = useState("");
  const textInput = useRef<HTMLInputElement>(null);
  const imageInput = useRef<HTMLInputElement>(null);
  const queryAllPosts = useQueryClient();

  function callCreatePostApi(formData: FormData) {
    return axios.post("https://route-posts.routemisr.com/posts", formData, {
      headers: { authorization: `Bearer ${localStorage.getItem("userToken")}` },
    });
  }

  function clearForms() {
    if (textInput.current) textInput.current.value = "";
    if (imageInput.current) imageInput.current.value = "";
    setisUploaded("");
  }

  const { isPending, mutate } = useMutation({
    mutationFn: callCreatePostApi,
    onSuccess: (res) => {
      toast.success(res.data.message || "Post created successfully!");
      clearForms();
      queryAllPosts.invalidateQueries({ queryKey: ["getAllPost"] });
      queryAllPosts.invalidateQueries({ queryKey: ["getUserPosts"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "An error occurred while creating the post.");
    },
  });

  function handleCreatePost() {
    const formData = new FormData();
    if (!textInput.current?.value && !imageInput.current?.files?.[0]) return;

    if (textInput.current?.value) {
      formData.append("body", textInput.current.value);
    }
    if (imageInput.current?.files?.[0]) {
      formData.append("image", imageInput.current.files[0]);
    }
    mutate(formData);
  }

  function handleImagePreview(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setisUploaded(imageUrl);
    }
  }

  return (
    <div className="w-full">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/80 p-4 sm:p-5 flex flex-col gap-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)] w-full">
        <div className="flex items-center gap-3 bg-slate-50/80 rounded-2xl p-3 border border-slate-200/60">
          {/* Profile Picture */}
          <div className="w-11 h-11 overflow-hidden shrink-0 rounded-full border border-slate-200 shadow-xs">
            <img
              className="w-full h-full object-cover"
              src={cat}
              alt="Profile"
            />
          </div>

          {/* Post Caption Input */}
          <input
            ref={textInput}
            className="flex-1 min-w-0 bg-transparent text-slate-900 text-sm sm:text-base placeholder:text-slate-400 outline-none px-2"
            placeholder="What's on your mind today?"
            type="text"
          />

          {/* Choose Image Button */}
          <label
            htmlFor="post-image"
            className="p-2.5 rounded-xl hover:bg-slate-200/60 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer flex items-center justify-center shrink-0"
            title="Attach image"
          >
            <input
              ref={imageInput}
              hidden
              id="post-image"
              type="file"
              accept="image/*"
              onChange={handleImagePreview}
            />
            <ImageIcon size={20} />
          </label>
        </div>

        {/* Image Preview */}
        {isUploaded && (
          <div className="relative h-72 rounded-2xl overflow-hidden border border-slate-200 shadow-inner group w-full">
            <img
              src={isUploaded}
              alt="Upload Preview"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute left-3 top-3 flex gap-2">
              <button className="h-9 px-3 rounded-xl bg-white/90 backdrop-blur-md shadow-md text-slate-700 border border-slate-200 flex items-center gap-1.5 text-xs font-bold hover:bg-white transition-all">
                <Pencil size={14} /> Edit
              </button>
              <button className="h-9 px-3 rounded-xl bg-white/90 backdrop-blur-md shadow-md text-slate-700 border border-slate-200 flex items-center gap-1.5 text-xs font-bold hover:bg-white transition-all">
                <PlusSquare size={14} /> Add more
              </button>
            </div>
            <button
              onClick={() => setisUploaded("")}
              aria-label="Remove photo"
              className="absolute right-3 top-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-md text-slate-700 border border-slate-200 flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <hr className="border-slate-100" />

        {/* Post Button */}
        <button
          type="button"
          disabled={isPending}
          onClick={handleCreatePost}
          className="w-full py-3 px-5 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-sm shadow-md disabled:opacity-55 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
        >
          {isPending ? (
            <FaSpinner className="text-white animate-spin text-base" />
          ) : (
            <>
              <Send size={16} /> Share Post
            </>
          )}
        </button>
      </div>
    </div>
  );
}
