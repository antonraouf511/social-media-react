import axios from "axios"
import { PostSkeleton } from "../../Components/Skeleton/PostSkeleton";
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import PostComponent from "../../Components/PostComponent/PostComponent"

export default function PostDetails() {
  const { id } = useParams();

  function getPostDetails() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
    });
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getSinglePost", id],
    queryFn: getPostDetails,
  });

  if (isLoading) {
    return (
      <div className="my-8 flex flex-col items-center max-w-xl mx-auto px-4 w-full">
        <PostSkeleton />
      </div>
    );
  }
  if (isError) {
    return <div className="text-center py-12 text-red-500 font-medium">{error.message}</div>;
  }

  return (
    <div className="my-8 flex flex-col items-center">
      <PostComponent post={data?.data.data.post} isPostDetails={true} />
    </div>
  );
}
