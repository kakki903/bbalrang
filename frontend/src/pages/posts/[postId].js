import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import api from "../../utils/api";
import CommentSection from "../../components/CommentSection";

export default function PostDetail() {
  const router = useRouter();
  const { postId } = router.query;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;
    async function fetchPost() {
      setLoading(true);
      try {
        const res = await api.get(`/posts/${postId}`);
        setPost(res.data.post);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [postId]);

  if (loading) return <Layout>로딩중...</Layout>;
  if (!post) return <Layout>게시글을 찾을 수 없습니다.</Layout>;

  return (
    <Layout>
      <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
      <div className="mb-6 text-gray-700 whitespace-pre-wrap">
        {post.content}
      </div>
      <div className="text-sm text-gray-500 mb-6">
        작성자 ID: {post.userId} | 게시판: {post.board.topic} ({post.board.age}
        세)
      </div>

      {/* 댓글 컴포넌트 추가 */}
      <CommentSection postId={postId} />
    </Layout>
  );
}
