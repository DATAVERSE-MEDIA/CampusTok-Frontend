// import { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAppStore } from "../store/useAppStore";
// import { useAuthStore } from "../store/useAuthStore";
// import {
//   Heart,
//   MessageCircle,
//   Share2,
//   BarChart3,
//   MoreVertical,
// } from "lucide-react";
// import { apiClient } from "../api";

// export default function StudentDashboard() {
//   const navigate = useNavigate();
//   const { selectedSchool } = useAppStore();
//   const { user, userType } = useAuthStore();
//   const [posts, setPosts] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);

//   // Debug: Log user and userType to verify they're set correctly
//   useEffect(() => {
//     console.log("StudentDashboard - User:", user);
//     console.log("StudentDashboard - UserType:", userType);
//   }, [user, userType]);

//   // Fetch posts for student dashboard
//   const fetchPosts = useCallback(async () => {
//     setIsLoading(true);

//     try {
//       const params = {
//         page,
//         limit: 10,
//         sortBy: "created_at",
//         sortOrder: "desc",
//       };

//       // Filter by school if selected, or get general feed
//       if (selectedSchool?.id) {
//        // params.filters = { school_id: selectedSchool.id };
//        params.school_scope= selectedSchool?.name
//       }

//       const response = await apiClient.get("/posts", { params });
//       const newPosts = response.data.data || response.data || [];

//       // For testing: use dummy data if API fails
//       if (newPosts.length === 0 && page === 1) {
//         setPosts([
//           {
//             id: 1,
//             content:
//               "At the University of Lagos, a new electric bus was introduced to shuttle students around campus. Silent and eco-friendly, it quickly became a symbol of innovation, inspiring students wh...",
//             author: {
//               full_name: "University of Lagos",
//               profile_picture: null,
//               role: "institution",
//             },
//             media_url: null,
//             likes_count: 11700,
//             comments_count: 500,
//             shares_count: 1000,
//             views_count: 100000,
//             created_at: new Date().toISOString(),
//           },
//         ]);
//         setIsLoading(false);
//         return;
//       }

//       if (page === 1) {
//         setPosts(newPosts);
//       } else {
//         setPosts((prev) => [...prev, ...newPosts]);
//       }

//       setHasMore(newPosts.length >= 10);
//     } catch (err) {
//       console.error("Error fetching posts:", err);
//       // Use dummy data for testing
//       setPosts([
//         {
//           id: 1,
//           content:
//             "At the University of Lagos, a new electric bus was introduced to shuttle students around campus. Silent and eco-friendly, it quickly became a symbol of innovation, inspiring students wh...",
//           author: {
//             full_name: "University of Lagos",
//             profile_picture: null,
//             role: "institution",
//           },
//           media_url: null,
//           likes_count: 11700,
//           comments_count: 500,
//           shares_count: 1000,
//           views_count: 100000,
//           created_at: new Date().toISOString(),
//         },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [selectedSchool, page]);

//   useEffect(() => {
//     fetchPosts();
//   }, [fetchPosts]);

//   const loadMorePosts = () => {
//     if (!isLoading && hasMore) {
//       setPage((prev) => prev + 1);
//     }
//   };

//   const formatCount = (count) => {
//     if (count >= 1000000) {
//       return (count / 1000000).toFixed(1) + "M";
//     } else if (count >= 1000) {
//       return (count / 1000).toFixed(1) + "k";
//     }
//     return count.toString();
//   };

//   const handleLike = async (postId) => {
//     try {
//       await apiClient.post(`/posts/${postId}/like`);
//       setPosts((prev) =>
//         prev.map((post) =>
//           post.id === postId
//             ? { ...post, likes_count: (post.likes_count || 0) + 1, liked: true }
//             : post
//         )
//       );
//     } catch (error) {
//       // Update optimistically even if API fails
//       setPosts((prev) =>
//         prev.map((post) =>
//           post.id === postId
//             ? { ...post, likes_count: (post.likes_count || 0) + 1, liked: true }
//             : post
//         )
//       );
//     }
//   };

//   const handleComment = (postId) => {
//     navigate(`/posts/${postId}`);
//   };

//   const handleShare = async (postId) => {
//     try {
//       await apiClient.post(`/posts/${postId}/share`);
//       setPosts((prev) =>
//         prev.map((post) =>
//           post.id === postId
//             ? { ...post, shares_count: (post.shares_count || 0) + 1 }
//             : post
//         )
//       );
//     } catch (error) {
//       setPosts((prev) =>
//         prev.map((post) =>
//           post.id === postId
//             ? { ...post, shares_count: (post.shares_count || 0) + 1 }
//             : post
//         )
//       );
//     }
//   };

//   // Loading skeleton
//   if (isLoading && posts.length === 0) {
//     return (
//       <div className="flex-1 flex flex-col lg:flex-row bg-white">
//         <div className="flex-1 overflow-y-auto w-full lg:w-auto">
//           <div className="max-w-3xl mx-auto p-3 sm:p-4 lg:p-6 pb-20 lg:pb-6">
//             {[...Array(2)].map((_, i) => (
//               <div
//                 key={i}
//                 className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 lg:mb-6 animate-pulse"
//               >
//                 <div className="p-3 lg:p-4">
//                   <div className="flex items-center gap-2 lg:gap-3">
//                     <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-300 rounded-full flex-shrink-0"></div>
//                     <div className="flex-1">
//                       <div className="h-3 lg:h-4 bg-gray-300 rounded w-24 lg:w-32 mb-2"></div>
//                       <div className="h-2 lg:h-3 bg-gray-300 rounded w-20 lg:w-24"></div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="px-3 lg:px-4 pb-3 lg:pb-4">
//                   <div className="h-2 lg:h-3 bg-gray-300 rounded w-full mb-2"></div>
//                   <div className="h-2 lg:h-3 bg-gray-300 rounded w-3/4"></div>
//                 </div>
//                 <div className="w-full h-48 lg:h-96 bg-gray-300"></div>
//               </div>
//             ))}
//           </div>
//         </div>
//         <div className="hidden lg:block lg:w-80 flex-shrink-0">
//           <RightSidebar navigate={navigate} />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 flex flex-col lg:flex-row bg-white">
//       {/* Main Content Area - Feed */}
//       <div className="flex-1 overflow-y-auto w-full lg:w-auto">
//         <div className="max-w-3xl mx-auto p-3 sm:p-4 lg:p-6 pb-20 lg:pb-6">
//           {posts.length === 0 && !isLoading ? (
//             <div className="text-center py-12">
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                 No posts yet
//               </h3>
//               <p className="text-gray-600">
//                 Follow schools or create a post to get started
//               </p>
//             </div>
//           ) : (
//             <>
//               {posts.map((post) => (
//                 <PostCard
//                   key={post.id}
//                   post={post}
//                   onLike={handleLike}
//                   onComment={handleComment}
//                   onShare={handleShare}
//                   formatCount={formatCount}
//                 />
//               ))}

//               {hasMore && (
//                 <div className="text-center mt-6">
//                   <button
//                     onClick={loadMorePosts}
//                     disabled={isLoading}
//                     className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-800 transition-colors disabled:opacity-50"
//                   >
//                     {isLoading ? "Loading..." : "Load More Posts"}
//                   </button>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>

//       {/* Right Sidebar - Chatbot Widget - Hidden on mobile */}
//       <div className="hidden lg:block lg:w-80 flex-shrink-0">
//         <RightSidebar navigate={navigate} />
//       </div>
//     </div>
//   );
// }

// // Post Card Component matching Figma design
// const PostCard = ({ post, onLike, onComment, onShare, formatCount }) => {
//   const [liked, setLiked] = useState(post.liked || false);
//   const [likesCount, setLikesCount] = useState(post.likes_count || 0);

//   console.log("post::" ,JSON.stringify(post))

//   const handleLike = () => {
//     const newLiked = !liked;
//     setLiked(newLiked);
//     setLikesCount((prev) => (newLiked ? prev + 1 : prev - 1));
//     if (newLiked) {
//       onLike(post.id);
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 lg:mb-6">
//       {/* Post Header */}
//       <div className="p-3 lg:p-4 flex items-start justify-between gap-2">
//         <div className="flex items-center gap-2 lg:gap-3 flex-1 min-w-0">
//           {/* Institution/Author Avatar */}
//           <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center">
//             {post.author?.profile_picture ? (
//               <img
//                 src={post.author.profile_picture}
//                 alt={post.author.full_name}
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <div className="w-full h-full bg-green-500 flex items-center justify-center">
//                 <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-full flex items-center justify-center">
//                   <span className="text-green-600 font-bold text-sm lg:text-base">
//                     {post.author?.full_name?.charAt(0) || "U"}
//                   </span>
//                 </div>
//               </div>
//             )}
//           </div>
//           <div className="flex-1 min-w-0">
//             <h3 className="font-bold text-gray-900 text-sm lg:text-base truncate">
//               {post.author?.full_name || "University of Lagos"}
//             </h3>
//             <p className="text-xs lg:text-sm text-gray-600 truncate">
//               {post.author?.address ||
//                 post.author?.location ||
//                 "University Road Lagos Mainland Akoka, Yaba, Lagos"}
//             </p>
//           </div>
//         </div>
//         <button className="p-1.5 lg:p-2 hover:bg-gray-100 rounded-full flex-shrink-0">
//           <MoreVertical className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
//         </button>
//       </div>

//       {/* Post Content */}
//       <div className="px-3 lg:px-4 pb-3 lg:pb-4">
//         <p className="text-sm lg:text-base text-gray-900 leading-relaxed whitespace-pre-line break-words">
//           {post.content}
//         </p>
//       </div>

//       {/* Post Image - Matching Figma design */}
//       {post.media && post.media.length >0 &&  (
//         <div className="w-full">
//           <div className="w-full aspect-square max-h-[600px] overflow-hidden bg-amber-50">
//             <img
//               src={post.media[0].url}
//               alt="Post content"
//               className="w-full h-full object-cover"
//               loading="lazy"
//             />
//           </div>
//         </div>
//       )}

//       {/* Placeholder for academic image if no media */}
//       {!post.media && (
//         <div className="w-full aspect-square max-h-[600px] overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
//           <div className="text-center">
//             <div className="w-40 h-40 mx-auto mb-4 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
//               <span className="text-7xl">👩‍🎓</span>
//             </div>
//             <p className="text-gray-600 text-sm">
//               Academic Regalia - University of Lagos
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Engagement Metrics - Matching Figma */}
//       <div className="px-3 lg:px-4 py-3 lg:py-4 border-t border-gray-200 flex items-center gap-4 lg:gap-6">
//         <button
//           onClick={handleLike}
//           className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
//         >
//           <Heart
//             className={`w-5 h-5 ${liked ? "fill-red-600 text-red-600" : ""}`}
//           />
//           <span className="font-medium text-sm lg:text-base">
//             {formatCount(likesCount)}
//           </span>
//         </button>
//         <button
//           onClick={() => onComment(post.id)}
//           className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
//         >
//           <MessageCircle className="w-5 h-5" />
//           <span className="font-medium text-sm lg:text-base">
//             {formatCount(post.comments_count || 0)}
//           </span>
//         </button>
//         <button
//           onClick={() => onShare(post.id)}
//           className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
//         >
//           <Share2 className="w-5 h-5" />
//           <span className="font-medium text-sm lg:text-base">
//             {formatCount(post.shares_count || 0)}
//           </span>
//         </button>
//         <div className="flex items-center gap-2 text-gray-600">
//           <BarChart3 className="w-5 h-5" />
//           <span className="font-medium text-sm lg:text-base">
//             {formatCount(post.views_count || 0)}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Right Sidebar - ChatBot Component matching Figma
// const RightSidebar = ({ navigate }) => (
//   <div className="w-full bg-gray-900 p-4 lg:p-6 flex items-start sticky top-0 h-fit">
//     <div className="bg-gray-800 rounded-lg p-4 lg:p-6 w-full">
//       <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
//         <div className="w-10 h-10 lg:w-20 lg:h-20 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
//           <span className="text-white text-lg lg:text-xl">
//             <img src="https://res.cloudinary.com/ddcfjn03w/image/upload/v1768467101/chatbot/chatbot%20icon.png"/>
//           </span>
          
//         </div>
//         <div>
//           <h3 className="font-bold text-white text-sm lg:text-base">
//             HI, I&apos;m ChatBot
//           </h3>
//         </div>
//       </div>
//       <p className="text-gray-300 text-xs lg:text-sm mb-4 lg:mb-6 leading-relaxed">
//         You can ask me questions based on a particular institution.
//       </p>
//       <button
//         onClick={() => navigate("/chatbot")}
//         className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2.5 lg:py-3 rounded-lg font-medium transition-colors text-sm lg:text-base"
//       >
//         Use ChatBot
//       </button>
//     </div>
//   </div>
// );


// pages/StudentDashboard.tsx
// import { useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAppStore } from "../store/useAppStore";
// import { useAuthStore } from "../store/useAuthStore";
// import {
//   Heart,
//   MessageCircle,
//   Share2,
//   BarChart3,
//   MoreVertical,
// } from "lucide-react";
// import { usePosts, usePostMutations } from "../hooks/usePosts";

// export default function StudentDashboard() {
//   const navigate = useNavigate();
//   const { selectedSchool } = useAppStore();
//   const { user, userType } = useAuthStore();

//   // Use the posts hook
//   const {
//     data,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     isLoading,
//     isError,
//     error,
//   } = usePosts();

//   // Use post mutations
//   const { likePost, sharePost } = usePostMutations();

//   // Debug: Log user and userType to verify they're set correctly
//   // useEffect(() => {
//   //   console.log("StudentDashboard - User:", user);
//   //   console.log("StudentDashboard - UserType:", userType);
//   // }, [user, userType]);

//   // Flatten posts from all pages
//   const posts = data?.pages.flatMap(page => page.posts) || [];

//   const loadMorePosts = () => {
//     if (hasNextPage && !isFetchingNextPage) {
//       fetchNextPage();
//     }
//   };

//   const formatCount = (count: number) => {
//     if (count >= 1000000) {
//       return (count / 1000000).toFixed(1) + "M";
//     } else if (count >= 1000) {
//       return (count / 1000).toFixed(1) + "k";
//     }
//     return count.toString();
//   };

//   const handleLike = (postId: string | number) => {
//     likePost.mutate(postId);
//   };

//   const handleComment = (postId: string | number) => {
//     navigate(`/posts/${postId}`);
//   };

//   const handleShare = (postId: string | number) => {
//     sharePost.mutate(postId);
//   };

//   // Loading skeleton
//   if (isLoading && posts.length === 0) {
//     return (
//       <div className="flex-1 flex flex-col lg:flex-row bg-white">
//         <div className="flex-1 overflow-y-auto w-full lg:w-auto">
//           <div className="max-w-3xl mx-auto p-3 sm:p-4 lg:p-6 pb-20 lg:pb-6">
//             {[...Array(2)].map((_, i) => (
//               <div
//                 key={i}
//                 className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 lg:mb-6 animate-pulse"
//               >
//                 <div className="p-3 lg:p-4">
//                   <div className="flex items-center gap-2 lg:gap-3">
//                     <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-300 rounded-full flex-shrink-0"></div>
//                     <div className="flex-1">
//                       <div className="h-3 lg:h-4 bg-gray-300 rounded w-24 lg:w-32 mb-2"></div>
//                       <div className="h-2 lg:h-3 bg-gray-300 rounded w-20 lg:w-24"></div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="px-3 lg:px-4 pb-3 lg:pb-4">
//                   <div className="h-2 lg:h-3 bg-gray-300 rounded w-full mb-2"></div>
//                   <div className="h-2 lg:h-3 bg-gray-300 rounded w-3/4"></div>
//                 </div>
//                 <div className="w-full h-48 lg:h-96 bg-gray-300"></div>
//               </div>
//             ))}
//           </div>
//         </div>
//         <div className="hidden lg:block lg:w-80 flex-shrink-0">
//           <RightSidebar navigate={navigate} />
//         </div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="flex-1 flex items-center justify-center bg-white">
//         <div className="text-center">
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">
//             Error loading posts
//           </h3>
//           <p className="text-gray-600">
//             {error?.message || "Please try again later"}
//           </p>
//           <button
//             onClick={() => window.location.reload()}
//             className="mt-4 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-800 transition-colors"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 flex flex-col lg:flex-row bg-white">
//       {/* Main Content Area - Feed */}
//       <div className="flex-1 overflow-y-auto w-full lg:w-auto">
//         <div className="max-w-3xl mx-auto p-3 sm:p-4 lg:p-6 pb-20 lg:pb-6">
//           {posts.length === 0 && !isLoading ? (
//             <div className="text-center py-12">
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                 No posts yet
//               </h3>
//               <p className="text-gray-600">
//                 Follow schools or create a post to get started
//               </p>
//             </div>
//           ) : (
//             <>
//               {posts.map((post) => (
//                 <PostCard
//                   key={post.id}
//                   post={post}
//                   onLike={handleLike}
//                   onComment={handleComment}
//                   onShare={handleShare}
//                   formatCount={formatCount}
//                 />
//               ))}

//               {hasNextPage && (
//                 <div className="text-center mt-6">
//                   <button
//                     onClick={loadMorePosts}
//                     disabled={isFetchingNextPage}
//                     className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-800 transition-colors disabled:opacity-50"
//                   >
//                     {isFetchingNextPage ? "Loading..." : "Load More Posts"}
//                   </button>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>

//       {/* Right Sidebar - Chatbot Widget - Hidden on mobile */}
//       <div className="hidden lg:block lg:w-80 flex-shrink-0">
//         <RightSidebar navigate={navigate} />
//       </div>
//     </div>
//   );
// }

// // Post Card Component matching Figma design
// const PostCard = ({ post, onLike, onComment, onShare, formatCount }: any) => {
//   const [liked, setLiked] = useState(post.liked || false);
//   const [likesCount, setLikesCount] = useState(post.likes_count || 0);

//   const handleLike = () => {
//     const newLiked = !liked;
//     setLiked(newLiked);
//     setLikesCount((prev: number) => (newLiked ? prev + 1 : prev - 1));
//     onLike(post.id);
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 lg:mb-6">
//       {/* Post Header */}
//       <div className="p-3 lg:p-4 flex items-start justify-between gap-2">
//         <div className="flex items-center gap-2 lg:gap-3 flex-1 min-w-0">
//           {/* Institution/Author Avatar */}
//           <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center">
//             {post.author?.profile_picture ? (
//               <img
//                 src={post.author.profile_picture}
//                 alt={post.author.full_name}
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <div className="w-full h-full bg-green-500 flex items-center justify-center">
//                 <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-full flex items-center justify-center">
//                   <span className="text-green-600 font-bold text-sm lg:text-base">
//                     {post.author?.full_name?.charAt(0) || "U"}
//                   </span>
//                 </div>
//               </div>
//             )}
//           </div>
//           <div className="flex-1 min-w-0">
//             <h3 className="font-bold text-gray-900 text-sm lg:text-base truncate">
//               {post.author?.full_name || "University of Lagos"}
//             </h3>
//             <p className="text-xs lg:text-sm text-gray-600 truncate">
//               {post.author?.address ||
//                 post.author?.location ||
//                 "University Road Lagos Mainland Akoka, Yaba, Lagos"}
//             </p>
//           </div>
//         </div>
//         <button className="p-1.5 lg:p-2 hover:bg-gray-100 rounded-full flex-shrink-0">
//           <MoreVertical className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
//         </button>
//       </div>

//       {/* Post Content */}
//       <div className="px-3 lg:px-4 pb-3 lg:pb-4">
//         <p className="text-sm lg:text-base text-gray-900 leading-relaxed whitespace-pre-line break-words">
//           {post.content}
//         </p>
//       </div>

//       {/* Post Image - Matching Figma design */}
//       {post.media && post.media.length > 0 && (
//         <div className="w-full">
//           <div className="w-full aspect-square max-h-[600px] overflow-hidden bg-amber-50">
//             <img
//               src={post.media[0].url}
//               alt="Post content"
//               className="w-full h-full object-cover"
//               loading="lazy"
//             />
//           </div>
//         </div>
//       )}

//       {/* Placeholder for academic image if no media */}
//       {!post.media && (
//         <div className="w-full aspect-square max-h-[600px] overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
//           <div className="text-center">
//             <div className="w-40 h-40 mx-auto mb-4 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
//               <span className="text-7xl">👩‍🎓</span>
//             </div>
//             <p className="text-gray-600 text-sm">
//               Academic Regalia - University of Lagos
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Engagement Metrics - Matching Figma */}
//       <div className="px-3 lg:px-4 py-3 lg:py-4 border-t border-gray-200 flex items-center gap-4 lg:gap-6">
//         <button
//           onClick={handleLike}
//           className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
//         >
//           <Heart
//             className={`w-5 h-5 ${liked ? "fill-red-600 text-red-600" : ""}`}
//           />
//           <span className="font-medium text-sm lg:text-base">
//             {formatCount(likesCount)}
//           </span>
//         </button>
//         <button
//           onClick={() => onComment(post.id)}
//           className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
//         >
//           <MessageCircle className="w-5 h-5" />
//           <span className="font-medium text-sm lg:text-base">
//             {formatCount(post.comments_count || 0)}
//           </span>
//         </button>
//         <button
//           onClick={() => onShare(post.id)}
//           className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
//         >
//           <Share2 className="w-5 h-5" />
//           <span className="font-medium text-sm lg:text-base">
//             {formatCount(post.shares_count || 0)}
//           </span>
//         </button>
//         <div className="flex items-center gap-2 text-gray-600">
//           <BarChart3 className="w-5 h-5" />
//           <span className="font-medium text-sm lg:text-base">
//             {formatCount(post.views_count || 0)}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Right Sidebar - ChatBot Component matching Figma
// const RightSidebar = ({ navigate }: any) => (
//   <div className="w-full bg-gray-900 p-4 lg:p-6 flex items-start sticky top-0 h-fit">
//     <div className="bg-gray-800 rounded-lg p-4 lg:p-6 w-full">
//       <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
//         <div className="w-10 h-10 lg:w-20 lg:h-20 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
//           <span className="text-white text-lg lg:text-xl">
//             <img src="https://res.cloudinary.com/ddcfjn03w/image/upload/v1768467101/chatbot/chatbot%20icon.png" alt="ChatBot" />
//           </span>
//         </div>
//         <div>
//           <h3 className="font-bold text-white text-sm lg:text-base">
//             HI, I&apos;m ChatBot
//           </h3>
//         </div>
//       </div>
//       <p className="text-gray-300 text-xs lg:text-sm mb-4 lg:mb-6 leading-relaxed">
//         You can ask me questions based on a particular institution.
//       </p>
//       <button
//         onClick={() => navigate("/chatbot")}
//         className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2.5 lg:py-3 rounded-lg font-medium transition-colors text-sm lg:text-base"
//       >
//         Use ChatBot
//       </button>
//     </div>
//   </div>
// );


// pages/StudentDashboard.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import { useAuthStore } from "../store/useAuthStore";
import {
  Heart,
  MessageCircle,
  Share2,
  BarChart3,
  Loader2,
  School,
} from "lucide-react";
import { useFetchInstitutionPosts, usePostMutations } from "../hooks/usePosts";
import PostActionsMenu from "../components/PostActionsMenu";
import { canDeletePost } from "../utils/postPermissions";
import { requestOpenCreatePost } from "../utils/createPost";
import { requestAuthNotice } from "../utils/authNotice";
import { CREATE_POST_AUTH_NOTICE } from "../utils/authNoticeContent";
import { isUserSessionAuthenticated } from "../utils/sessionAuth";

export default function StudentLandingPage() {
  const navigate = useNavigate();
  const { selectedSchool } = useAppStore();
  const { user, isAuthenticated } = useAuthStore();
  const canCreatePost = isUserSessionAuthenticated(isAuthenticated);

  // Get current user data including student profile
  //const { data: userData, isLoading: meIsLoading, error: userError } = useCurrentUser()
  
  // State for posts
  const [posts, setPosts] = useState<any[]>([])
  const [skip, setSkip] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [deletingPostId, setDeletingPostId] = useState<string | number | null>(
    null
  );

  // Use the mutation to fetch institution posts for the student's school
  const { 
    mutate: fetchPosts, 
    isPending: isFetchingPosts, 
    error: postsError 
  } = useFetchInstitutionPosts({
    onSuccess: (data) => {
      // Append new posts to existing ones
      if (skip === 0) {
        setPosts(data.posts)
      } else {
        setPosts(prev => [...prev, ...data.posts])
      }
      setHasMore(data.hasMore)
    },
    onError: (error) => {
      console.error('Error fetching institution posts:', error)
    }
  })

  // Extract student institution info
//   const institutionId = userData?.student_profile?.institution_id
//   const institutionName = userData?.student_profile?.institution_name
//   const department = userData?.student_profile?.department
//   const faculty = userData?.student_profile?.faculty

  // Fetch posts when institution ID is available OR when selected school changes
  useEffect(() => {
    const targetInstitutionId = selectedSchool?.id //|| institutionId
    
    if (targetInstitutionId ) {
      fetchPosts({
        institution_id: targetInstitutionId,
        skip: 0,
        limit: 10,
        post_type: 'all'
      })
      setSkip(0) // Reset skip on initial load
    }
  }, [selectedSchool?.id, fetchPosts])

  // Use post mutations
  const { likePost, sharePost, deletePost } = usePostMutations();

  const handleCreatePostClick = () => {
    if (!canCreatePost) {
      requestAuthNotice(CREATE_POST_AUTH_NOTICE);
      return;
    }

    requestOpenCreatePost();
  };

  const loadMorePosts = () => {
    const targetInstitutionId = selectedSchool?.id //|| institutionId
    
    if (hasMore && targetInstitutionId && !isFetchingPosts) {
      const nextSkip = skip + 10
      fetchPosts({
        institution_id: targetInstitutionId,
        skip: nextSkip,
        limit: 10,
        post_type: 'all'
      })
      setSkip(nextSkip)
    }
  }

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + "M";
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + "k";
    }
    return count.toString();
  };

  const handleLike = (postId: string | number) => {
    // Update local state optimistically
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            likes_count: (post.likes_count || 0) + 1,
            liked: true 
          }
        : post
    ))
    likePost.mutate(postId);
  };

  const handleComment = (postId: string | number) => {
    navigate(`/posts/${postId}`);
  };

  const handleShare = (postId: string | number) => {
    // Update local state optimistically
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            shares_count: (post.shares_count || 0) + 1 
          }
        : post
    ))
    sharePost.mutate(postId);
  };

  const handleDelete = async (postId: string | number) => {
    const shouldDelete = window.confirm(
      "Delete this post? This action cannot be undone."
    );

    if (!shouldDelete) return;

    setDeletingPostId(postId);

    try {
      await deletePost.mutateAsync(postId);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        "Failed to delete post. Please try again.";
      window.alert(message);
    } finally {
      setDeletingPostId(null);
    }
  };

  // Loading skeleton for user data
  if (isFetchingPosts) {
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

  // Error handling for user data
  if (postsError) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error loading student data
          </h3>
          <p className="text-gray-600">
            {postsError?.message || "Please try again later"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-800 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Check if student has institution profile
//   if (!institutionId && !selectedSchool?.id && !meIsLoading) {
//     return (
//       <div className="flex-1 flex items-center justify-center bg-white">
//         <div className="text-center">
//           <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <School className="w-10 h-10 text-blue-600" />
//           </div>
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">
//             No School Selected
//           </h3>
//           <p className="text-gray-600 mb-6">
//             {userData?.student_profile 
//               ? "Complete your student profile to view posts from your institution."
//               : "Select a school from the dropdown to view posts."}
//           </p>
//           {!userData?.student_profile && (
//             <button
//               onClick={() => navigate('/complete-profile')}
//               className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-800 transition-colors"
//             >
//               Complete Profile
//             </button>
//           )}
//         </div>
//       </div>
//     );
//   }

  const currentInstitutionName = selectedSchool?.name //|| institutionName

  return (
    <div className="flex-1 flex flex-col lg:flex-row bg-white">
      {/* Student/Institution Header */}
      {/* {(currentInstitutionName || department || faculty) && (
        <div className="w-full bg-gradient-to-r from-blue-600 to-blue-800 p-4 lg:p-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <School className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl lg:text-2xl font-bold text-white">
                  {currentInstitutionName || "Student Dashboard"}
                </h1>
                <div className="flex flex-wrap gap-3 mt-2">
                  {department && (
                    <span className="px-3 py-1 bg-white/20 text-white text-sm rounded-full backdrop-blur-sm">
                      {department}
                    </span>
                  )}
                  {faculty && (
                    <span className="px-3 py-1 bg-white/20 text-white text-sm rounded-full backdrop-blur-sm">
                      {faculty}
                    </span>
                  )}
                  {userData?.student_profile?.educational_level && (
                    <span className="px-3 py-1 bg-white/20 text-white text-sm rounded-full backdrop-blur-sm">
                      {userData.student_profile.educational_level}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}

      {/* Main Content Area - Feed */}
      <div className="flex-1 overflow-y-auto w-full lg:w-auto">
        <div className="max-w-3xl mx-auto p-3 sm:p-4 lg:p-6 pb-20 lg:pb-6">
          {/* Error message for posts */}
          {postsError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">
                Error loading posts: {postsError.message}
              </p>
              <button
                onClick={() => {
                  const targetInstitutionId = selectedSchool?.id //|| institutionId
                  if (targetInstitutionId) {
                    fetchPosts({
                      institution_id: targetInstitutionId,
                      skip: 0,
                      limit: 10,
                      post_type: 'all'
                    })
                  }
                }}
                className="mt-2 text-sm text-primary-600 hover:text-primary-800 font-medium"
              >
                Try Again
              </button>
            </div>
          )}

          {posts.length === 0 && !isFetchingPosts ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <School className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No posts yet
              </h3>
              <p className="text-gray-600 mb-6">
                {selectedSchool 
                  ? `No posts from ${selectedSchool.name} yet. Be the first to create content!`
                  : "Follow schools or browse posts to get started"}
              </p>
              <button
                onClick={handleCreatePostClick}
                className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-800 transition-colors"
              >
                Create Post
              </button>
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
                  onDelete={handleDelete}
                  canDelete={canDeletePost(post, user)}
                  isDeleting={deletingPostId === post.id}
                  formatCount={formatCount}
                />
              ))}

              {/* Loading indicator for more posts */}
              {isFetchingPosts && (
                <div className="text-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-primary-600 mx-auto" />
                </div>
              )}
              
              {hasMore && !isFetchingPosts && (
                <div className="text-center mt-6">
                  <button
                    onClick={loadMorePosts}
                    disabled={isFetchingPosts}
                    className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Load More Posts
                  </button>
                </div>
              )}

              {!hasMore && posts.length > 0 && (
                <div className="text-center mt-6 pt-4 border-t border-gray-200">
                  <p className="text-gray-500 text-sm">
                    {selectedSchool
                      ? `You've seen all posts from ${selectedSchool.name}`
                      : "You've seen all available posts"}
                  </p>
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
const PostCard = ({
  post,
  onLike,
  onComment,
  onShare,
  onDelete,
  canDelete,
  isDeleting,
  formatCount,
}: any) => {
  const [liked, setLiked] = useState(post.liked || false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount((prev: number) => (newLiked ? prev + 1 : prev - 1));
    onLike(post.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 lg:mb-6">
      {/* Post Header */}
      <div className="p-3 lg:p-4 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 lg:gap-3 flex-1 min-w-0">
          {/* Institution/Author Avatar */}
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center">
            {post.author?.profile_picture ? (
              <img
                src={post.author.profile_picture}
                alt={post.author.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-green-500 flex items-center justify-center">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm lg:text-base">
                    {post.author?.full_name?.charAt(0) || "U"}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-sm lg:text-base truncate">
              {post.author?.full_name || "Institution"}
            </h3>
            <p className="text-xs lg:text-sm text-gray-600 truncate">
              {post.author?.address ||
                post.author?.location ||
                ""}
            </p>
          </div>
        </div>
        <PostActionsMenu
          canDelete={canDelete}
          isDeleting={isDeleting}
          onDelete={() => onDelete(post.id)}
        />
      </div>

      {/* Post Content */}
      <div className="px-3 lg:px-4 pb-3 lg:pb-4">
        <p className="text-sm lg:text-base text-gray-900 leading-relaxed whitespace-pre-line break-words">
          {post.content}
        </p>
      </div>

      {/* Post Image - Matching Figma design */}
      {post.media && post.media.length > 0 && (
        <div className="w-full">
          <div className="w-full aspect-square max-h-[600px] overflow-hidden bg-amber-50">
            <img
              src={post.media[0].url}
              alt="Post content"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {/* Placeholder for academic image if no media */}
      {!post.media && (
        <div className="w-full aspect-square max-h-[600px] overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-40 h-40 mx-auto mb-4 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-7xl">👩‍🎓</span>
            </div>
            <p className="text-gray-600 text-sm">
              Academic Regalia
            </p>
          </div>
        </div>
      )}

      {/* Engagement Metrics - Matching Figma */}
      <div className="px-3 lg:px-4 py-3 lg:py-4 border-t border-gray-200 flex flex-wrap items-center gap-x-4 gap-y-3 lg:gap-x-6">
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

// Right Sidebar - ChatBot Component matching Figma
const RightSidebar = ({ navigate }: any) => (
  <div className="w-full bg-gray-900 p-4 lg:p-6 flex items-start sticky top-0 h-fit">
    <div className="bg-gray-800 rounded-lg p-4 lg:p-6 w-full">
      <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
        <div className="w-10 h-10 lg:w-20 lg:h-20 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-lg lg:text-xl">
            <img src="https://res.cloudinary.com/ddcfjn03w/image/upload/v1768467101/chatbot/chatbot%20icon.png" alt="ChatBot" />
          </span>
        </div>
        <div>
          <h3 className="font-bold text-white text-sm lg:text-base">
            HI, I&apos;m ChatBot
          </h3>
        </div>
      </div>
      <p className="text-gray-300 text-xs lg:text-sm mb-4 lg:mb-6 leading-relaxed">
        You can ask me questions based on a particular institution.
      </p>
      <button
        onClick={() => navigate("/chatbot")}
        className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2.5 lg:py-3 rounded-lg font-medium transition-colors text-sm lg:text-base"
      >
        Use ChatBot
      </button>
    </div>
  </div>
);
