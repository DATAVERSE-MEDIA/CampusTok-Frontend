import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useAppStore } from "../store/useAppStore";
import {
  Heart,
  MessageCircle,
  Share2,
  BarChart3,
  MoreVertical,
  TrendingUp,
  Users,
  MessageSquare,
  Brain,
} from "lucide-react";
import { apiClient } from "../api";
import RightSidebar from "../components/RightSideBar";

export default function InstitutionDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { selectedSchool } = useAppStore();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Track previous school to detect changes
  const prevSchoolRef = useRef(selectedSchool?.id);

  // Reset pagination and posts when school changes
  useEffect(() => {
    if (prevSchoolRef.current !== selectedSchool?.id) {
      setPosts([]);
      setPage(1);
      setHasMore(true);
      prevSchoolRef.current = selectedSchool?.id;
    }
  }, [selectedSchool]);

  // Get school-specific image based on selected school
  const getSchoolImage = (index = 0) => {
    const schoolName = selectedSchool?.name?.toLowerCase() || "";

    // Map school names to their folder and image files
    if (schoolName.includes("lagos") || schoolName.includes("unilag")) {
      const images = [
        "/post-images/unilag post feed/unilag post 1.svg",
        "/post-images/unilag post feed/unilag vice chancellor 1.svg",
      ];
      return images[index % images.length];
    } else if (schoolName.includes("oau") || schoolName.includes("obafemi")) {
      const images = [
        "/post-images/oau post feed/image 23.svg",
        "/post-images/oau post feed/image 8.svg",
      ];
      return images[index % images.length];
    } else if (schoolName.includes("yabatech") || schoolName.includes("yaba")) {
      const images = [
        "/post-images/yabatech post feed/image 6.svg",
        "/post-images/yabatech post feed/image 7.svg",
      ];
      return images[index % images.length];
    }

    // Default to unilag
    return "/post-images/unilag post feed/unilag post 1.svg";
  };

  // Fetch posts for institution dashboard
  const fetchPosts = useCallback(async () => {
    setIsLoading(true);

    try {
      let response;
      const skip = (page - 1) * 10;

      if (selectedSchool?.id) {
        response = await apiClient.get(
          `/posts/institution/${selectedSchool.id}`,
          {
            params: { skip, limit: 10 },
          },
        );
      } else {
        response = await apiClient.get("/posts", {
          params: { skip, limit: 10 },
        });
      }

      const newPosts = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];

      // Use dummy data if no posts
      if (newPosts.length === 0 && page === 1) {
        const schoolName = selectedSchool?.name || "University of Lagos";
        setPosts([
          {
            id: 1,
            content: `Welcome to ${schoolName}! This is your institution dashboard where you can manage posts, monitor sentiment, and engage with students.`,
            author: {
              full_name: schoolName,
              profile_picture: selectedSchool?.logo || null,
              role: "institution",
            },
            media: [{ url: getSchoolImage(0) }],
            likes_count: 1500,
            comments_count: 120,
            shares_count: 45,
            views_count: 8500,
            created_at: new Date().toISOString(),
          },
        ]);
        setIsLoading(false);
        return;
      }

      if (page === 1) {
        setPosts(newPosts);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
      }

      setHasMore(newPosts.length >= 10);
    } catch (err) {
      console.error("Error fetching posts:", err);
      const schoolName = selectedSchool?.name || "University of Lagos";
      setPosts([
        {
          id: 1,
          content: `Welcome to ${schoolName}! This is your institution dashboard.`,
          author: {
            full_name: schoolName,
            profile_picture: selectedSchool?.logo || null,
            role: "institution",
          },
          media: [{ url: getSchoolImage(0) }],
          likes_count: 1500,
          comments_count: 120,
          shares_count: 45,
          views_count: 8500,
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedSchool, page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const loadMorePosts = () => {
    if (!isLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const formatCount = (count) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + "M";
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + "k";
    }
    return count.toString();
  };

  const handleLike = async (postId) => {
    try {
      await apiClient.post(`/posts/${postId}/like`);
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, likes_count: (post.likes_count || 0) + 1, liked: true }
            : post,
        ),
      );
    } catch (error) {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, likes_count: (post.likes_count || 0) + 1, liked: true }
            : post,
        ),
      );
    }
  };

  const handleComment = (postId) => {
    navigate(`/posts/${postId}`);
  };

  const handleShare = async (postId) => {
    try {
      await apiClient.post(`/posts/${postId}/share`);
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, shares_count: (post.shares_count || 0) + 1 }
            : post,
        ),
      );
    } catch (error) {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, shares_count: (post.shares_count || 0) + 1 }
            : post,
        ),
      );
    }
  };

  // Loading skeleton
  if (isLoading && posts.length === 0) {
    return (
      <div className="flex-1 flex flex-col lg:flex-row bg-white">
        <div className="flex-1 overflow-y-auto w-full lg:w-auto">
          <div className="max-w-3xl mx-auto p-3 sm:p-4 lg:p-6 pb-20 lg:pb-6">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 lg:mb-6 animate-pulse"
              >
                <div className="p-3 lg:p-4">
                  <div className="flex items-center gap-2 lg:gap-3">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-300 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="h-3 lg:h-4 bg-gray-300 rounded w-24 lg:w-32 mb-2"></div>
                      <div className="h-2 lg:h-3 bg-gray-300 rounded w-20 lg:w-24"></div>
                    </div>
                  </div>
                </div>
                <div className="px-3 lg:px-4 pb-3 lg:pb-4">
                  <div className="h-2 lg:h-3 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-2 lg:h-3 bg-gray-300 rounded w-3/4"></div>
                </div>
                <div className="w-full h-48 lg:h-96 bg-gray-300"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden lg:block lg:w-80 flex-shrink-0">
          <RightSidebar navigate={navigate} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row bg-white">
      {/* Main Content Area - Feed */}
      <div className="flex-1 overflow-y-auto w-full lg:w-auto">
        <div className="max-w-3xl mx-auto p-3 sm:p-4 lg:p-6 pb-20 lg:pb-6">
          {/* Quick Actions for Institutions */}
          <div className="mb-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              onClick={() => navigate("/sentiment-bank")}
              className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-md"
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-sm">Sentiment Bank</p>
                <p className="text-xs text-white/80">AI Analysis</p>
              </div>
            </button>
            <button
              onClick={() => navigate("/chatbot")}
              className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-sm">Train Chatbot</p>
                <p className="text-xs text-white/80">Upload docs</p>
              </div>
            </button>
            <button
              onClick={() => navigate("/community")}
              className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-md"
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-sm">Community</p>
                <p className="text-xs text-white/80">Manage groups</p>
              </div>
            </button>
            <button
              onClick={() => alert("Analytics Dashboard - Coming Soon!")}
              className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-md"
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-sm">Analytics</p>
                <p className="text-xs text-white/80">View stats</p>
              </div>
            </button>
          </div>

          {posts.length === 0 && !isLoading ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No posts yet
              </h3>
              <p className="text-gray-600">
                Create a post to engage with your community
              </p>
            </div>
          ) : (
            <>
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onComment={handleComment}
                  onShare={handleShare}
                  formatCount={formatCount}
                />
              ))}

              {hasMore && (
                <div className="text-center mt-6">
                  <button
                    onClick={loadMorePosts}
                    disabled={isLoading}
                    className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-800 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? "Loading..." : "Load More Posts"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right Sidebar - Chatbot Widget - Hidden on mobile */}
      <div className="hidden lg:block lg:w-80 flex-shrink-0">
        <RightSidebar navigate={navigate} />
      </div>
    </div>
  );
}

// Post Card Component matching Figma design
const PostCard = ({ post, onLike, onComment, onShare, formatCount }) => {
  const [liked, setLiked] = useState(post.liked || false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount((prev) => (newLiked ? prev + 1 : prev - 1));
    if (newLiked) {
      onLike(post.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 lg:mb-6">
      {/* Post Header */}
      <div className="p-3 lg:p-4 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 lg:gap-3 flex-1 min-w-0">
          {/* Institution Avatar - Matching Figma (green background with white circle) */}
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center">
            <div className="w-full h-full bg-green-500 flex items-center justify-center">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm lg:text-base">
                  {post.author?.full_name?.charAt(0) || "U"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-sm lg:text-base truncate">
              {post.author?.full_name || "University of Lagos"}
            </h3>
            <p className="text-xs lg:text-sm text-gray-600 truncate">
              {post.author?.address ||
                "University Road Lagos Mainland Akoka, Yaba, Lagos"}
            </p>
          </div>
        </div>
        <button className="p-1.5 lg:p-2 hover:bg-gray-100 rounded-full flex-shrink-0">
          <MoreVertical className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
        </button>
      </div>

      {/* Post Content */}
      <div className="px-3 lg:px-4 pb-3 lg:pb-4">
        <p className="text-sm lg:text-base text-gray-900 leading-relaxed whitespace-pre-line break-words">
          {post.content}
        </p>
      </div>

      {/* Post Image - Academic Regalia Image (Matching Figma) */}
      {post.media && post.media.length > 0 ? (
        <div className="w-full">
          <div className="w-full aspect-square max-h-[600px] overflow-hidden">
            <img
              src={post.media[0].url}
              alt="Post content"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      ) : (
        <div className="w-full aspect-square max-h-[600px] overflow-hidden bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50 flex items-center justify-center relative">
          {/* Academic Regalia Image Placeholder - Matching Figma design (second image) */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Woman in academic regalia - styled to match Figma */}
            <div className="relative">
              {/* Face/Head */}
              <div className="w-32 h-32 lg:w-40 lg:h-40 mx-auto mb-2 bg-amber-200 rounded-full flex items-center justify-center shadow-lg relative z-10">
                <div className="w-24 h-24 lg:w-32 lg:h-32 bg-amber-300 rounded-full flex items-center justify-center">
                  <span className="text-4xl lg:text-6xl">👩‍🎓</span>
                </div>
              </div>
              {/* Academic Cap (Maroon with gold band) */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-28 lg:w-36 h-12 lg:h-16 bg-gradient-to-b from-red-800 to-red-900 rounded-t-full shadow-lg">
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-yellow-500"></div>
                {/* Tassel */}
                <div className="absolute top-2 right-4 lg:right-6 w-1 h-6 lg:h-8 bg-yellow-400 rounded-full"></div>
              </div>
              {/* Academic Gown/Robe (Maroon with gold trim) */}
              <div className="absolute top-24 lg:top-32 left-1/2 transform -translate-x-1/2 w-36 lg:w-48 h-32 lg:h-40 bg-gradient-to-b from-red-800 to-red-900 rounded-b-full shadow-xl">
                {/* Gold trim on gown */}
                <div className="absolute top-0 left-4 lg:left-6 right-4 lg:right-6 h-1 bg-yellow-500"></div>
                <div className="absolute bottom-8 left-4 lg:left-6 right-4 lg:right-6 h-1 bg-yellow-500"></div>
              </div>
              {/* Sash/Stole (Pink with gold trim) */}
              <div className="absolute top-28 lg:top-36 left-1/2 transform -translate-x-1/2 w-32 lg:w-40 h-20 lg:h-24 bg-gradient-to-b from-pink-400 to-pink-500 rounded-lg shadow-lg">
                <div className="absolute inset-1 border-2 border-yellow-400 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Engagement Metrics - Matching Figma */}
      <div className="px-3 lg:px-4 py-3 lg:py-4 border-t border-gray-200 flex items-center gap-4 lg:gap-6">
        <button
          onClick={handleLike}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
        >
          <Heart
            className={`w-5 h-5 ${liked ? "fill-red-600 text-red-600" : ""}`}
          />
          <span className="font-medium text-sm lg:text-base">
            {formatCount(likesCount)}
          </span>
        </button>
        <button
          onClick={() => onComment(post.id)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium text-sm lg:text-base">
            {formatCount(post.comments_count || 0)}
          </span>
        </button>
        <button
          onClick={() => onShare(post.id)}
          className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
        >
          <Share2 className="w-5 h-5" />
          <span className="font-medium text-sm lg:text-base">
            {formatCount(post.shares_count || 0)}
          </span>
        </button>
        <div className="flex items-center gap-2 text-gray-600">
          <BarChart3 className="w-5 h-5" />
          <span className="font-medium text-sm lg:text-base">
            {formatCount(post.views_count || 0)}
          </span>
        </div>
      </div>
    </div>
  );
};
