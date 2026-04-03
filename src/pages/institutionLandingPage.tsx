// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useAuthStore } from '../store/useAuthStore'
// import { useAppStore } from '../store/useAppStore'
// import { Heart, MessageCircle, Share2, BarChart3, MoreVertical } from 'lucide-react'
// import { apiClient } from '../api'
// import RightSidebar from '../components/RightSideBar'

// export default function InstitutionDashboard() {
//   const navigate = useNavigate()
//   const { user } = useAuthStore()
//   const { selectedSchool } = useAppStore()
//   const [posts, setPosts] = useState([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [page, setPage] = useState(1)
//   const [hasMore, setHasMore] = useState(true)

//   // Fetch posts for institution dashboard
//   useEffect(() => {
//     fetchPosts()
//   }, [selectedSchool, page])

//   const fetchPosts = async () => {
//     setIsLoading(true)
    
//     try {
//       const params = {
//         page,
//         limit: 10,
//         sortBy: 'created_at',
//         sortOrder: 'desc'
//       }

//       if (selectedSchool?.id) {
//         params.filters = { school_id: selectedSchool.id }
//       }

//       const response = await apiClient.get('/posts', { params })
//       const newPosts = response.data.data || response.data || []
      
//       // For testing: use dummy data matching Figma design
//       if (newPosts.length === 0 && page === 1) {
//         setPosts([{
//           id: 1,
//           content: "At the University of Lagos, a new electric bus was introduced to shuttle students around campus. Silent and eco-friendly, it quickly became a symbol of innovation, inspiring students wh...",
//           author: {
//             full_name: "University of Lagos",
//             profile_picture: null,
//             role: "institution",
//             address: "University Road Lagos Mainland Akoka, Yaba, Lagos"
//           },
//           media_url: null,
//           likes_count: 11700,
//           comments_count: 500,
//           shares_count: 1000,
//           views_count: 100000,
//           created_at: new Date().toISOString()
//         }])
//         setIsLoading(false)
//         return
//       }
      
//       if (page === 1) {
//         setPosts(newPosts)
//       } else {
//         setPosts(prev => [...prev, ...newPosts])
//       }
      
//       setHasMore(newPosts.length >= 10)
//     } catch (err) {
//       console.error('Error fetching posts:', err)
//       // Use dummy data for testing matching Figma
//       setPosts([{
//         id: 1,
//         content: "At the University of Lagos, a new electric bus was introduced to shuttle students around campus. Silent and eco-friendly, it quickly became a symbol of innovation, inspiring students wh...",
//         author: {
//           full_name: "University of Lagos",
//           profile_picture: null,
//           role: "institution",
//           address: "University Road Lagos Mainland Akoka, Yaba, Lagos"
//         },
//         media_url: null,
//         likes_count: 11700,
//         comments_count: 500,
//         shares_count: 1000,
//         views_count: 100000,
//         created_at: new Date().toISOString()
//       }])
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const loadMorePosts = () => {
//     if (!isLoading && hasMore) {
//       setPage(prev => prev + 1)
//     }
//   }

//   const formatCount = (count) => {
//     if (count >= 1000000) {
//       return (count / 1000000).toFixed(1) + 'M'
//     } else if (count >= 1000) {
//       return (count / 1000).toFixed(1) + 'k'
//     }
//     return count.toString()
//   }

//   const handleLike = async (postId) => {
//     try {
//       await apiClient.post(`/posts/${postId}/like`)
//       setPosts(prev => prev.map(post => 
//         post.id === postId 
//           ? { ...post, likes_count: (post.likes_count || 0) + 1, liked: true }
//           : post
//       ))
//     } catch (error) {
//       setPosts(prev => prev.map(post => 
//         post.id === postId 
//           ? { ...post, likes_count: (post.likes_count || 0) + 1, liked: true }
//           : post
//       ))
//     }
//   }

//   const handleComment = (postId) => {
//     navigate(`/posts/${postId}`)
//   }

//   const handleShare = async (postId) => {
//     try {
//       await apiClient.post(`/posts/${postId}/share`)
//       setPosts(prev => prev.map(post => 
//         post.id === postId 
//           ? { ...post, shares_count: (post.shares_count || 0) + 1 }
//           : post
//       ))
//     } catch (error) {
//       setPosts(prev => prev.map(post => 
//         post.id === postId 
//           ? { ...post, shares_count: (post.shares_count || 0) + 1 }
//           : post
//       ))
//     }
//   }

  
//   // Loading skeleton
//   if (isLoading && posts.length === 0) {
//     return (
//       <div className="flex-1 flex flex-col lg:flex-row bg-white">
//         <div className="flex-1 overflow-y-auto w-full lg:w-auto">
//           <div className="max-w-3xl mx-auto p-3 sm:p-4 lg:p-6 pb-20 lg:pb-6">
//             {[...Array(2)].map((_, i) => (
//               <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 lg:mb-6 animate-pulse">
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
//     )
//   }

//   return (
//     <div className="flex-1 flex flex-col lg:flex-row bg-white">
//       {/* Main Content Area - Feed */}
//       <div className="flex-1 overflow-y-auto w-full lg:w-auto">
//         <div className="max-w-3xl mx-auto p-3 sm:p-4 lg:p-6 pb-20 lg:pb-6">
//           {posts.length === 0 && !isLoading ? (
//             <div className="text-center py-12">
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
//               <p className="text-gray-600">Create a post to engage with your community</p>
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
//                     {isLoading ? 'Loading...' : 'Load More Posts'}
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
//   )
// }

// // Post Card Component matching Figma design
// const PostCard = ({ post, onLike, onComment, onShare, formatCount }) => {
//   const [liked, setLiked] = useState(post.liked || false)
//   const [likesCount, setLikesCount] = useState(post.likes_count || 0)

//   const handleLike = () => {
//     const newLiked = !liked
//     setLiked(newLiked)
//     setLikesCount(prev => newLiked ? prev + 1 : prev - 1)
//     if (newLiked) {
//       onLike(post.id)
//     }
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 lg:mb-6">
//       {/* Post Header */}
//       <div className="p-3 lg:p-4 flex items-start justify-between gap-2">
//         <div className="flex items-center gap-2 lg:gap-3 flex-1 min-w-0">
//           {/* Institution Avatar - Matching Figma (green background with white circle) */}
//           <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center">
//             <div className="w-full h-full bg-green-500 flex items-center justify-center">
//               <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-full flex items-center justify-center">
//                 <span className="text-green-600 font-bold text-sm lg:text-base">
//                   {post.author?.full_name?.charAt(0) || 'U'}
//                 </span>
//               </div>
//             </div>
//           </div>
//           <div className="flex-1 min-w-0">
//             <h3 className="font-bold text-gray-900 text-sm lg:text-base truncate">
//               {post.author?.full_name || 'University of Lagos'}
//             </h3>
//             <p className="text-xs lg:text-sm text-gray-600 truncate">
//               {post.author?.address || 'University Road Lagos Mainland Akoka, Yaba, Lagos'}
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

//       {/* Post Image - Academic Regalia Image (Matching Figma) */}
//       {post.media && post.media.length >0 ?  (
//         <div className="w-full">
//           <div className="w-full aspect-square max-h-[600px] overflow-hidden">
//             <img 
//               src={post.media[0].url} 
//               alt="Post content"
//               className="w-full h-full object-cover"
//               loading="lazy"
//             />
//           </div>
//         </div>
//       ) : (
//         <div className="w-full aspect-square max-h-[600px] overflow-hidden bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50 flex items-center justify-center relative">
//           {/* Academic Regalia Image Placeholder - Matching Figma design (second image) */}
//           <div className="relative w-full h-full flex items-center justify-center">
//             {/* Woman in academic regalia - styled to match Figma */}
//             <div className="relative">
//               {/* Face/Head */}
//               <div className="w-32 h-32 lg:w-40 lg:h-40 mx-auto mb-2 bg-amber-200 rounded-full flex items-center justify-center shadow-lg relative z-10">
//                 <div className="w-24 h-24 lg:w-32 lg:h-32 bg-amber-300 rounded-full flex items-center justify-center">
//                   <span className="text-4xl lg:text-6xl">👩‍🎓</span>
//                 </div>
//               </div>
//               {/* Academic Cap (Maroon with gold band) */}
//               <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-28 lg:w-36 h-12 lg:h-16 bg-gradient-to-b from-red-800 to-red-900 rounded-t-full shadow-lg">
//                 <div className="absolute bottom-0 left-0 right-0 h-2 bg-yellow-500"></div>
//                 {/* Tassel */}
//                 <div className="absolute top-2 right-4 lg:right-6 w-1 h-6 lg:h-8 bg-yellow-400 rounded-full"></div>
//               </div>
//               {/* Academic Gown/Robe (Maroon with gold trim) */}
//               <div className="absolute top-24 lg:top-32 left-1/2 transform -translate-x-1/2 w-36 lg:w-48 h-32 lg:h-40 bg-gradient-to-b from-red-800 to-red-900 rounded-b-full shadow-xl">
//                 {/* Gold trim on gown */}
//                 <div className="absolute top-0 left-4 lg:left-6 right-4 lg:right-6 h-1 bg-yellow-500"></div>
//                 <div className="absolute bottom-8 left-4 lg:left-6 right-4 lg:right-6 h-1 bg-yellow-500"></div>
//               </div>
//               {/* Sash/Stole (Pink with gold trim) */}
//               <div className="absolute top-28 lg:top-36 left-1/2 transform -translate-x-1/2 w-32 lg:w-40 h-20 lg:h-24 bg-gradient-to-b from-pink-400 to-pink-500 rounded-lg shadow-lg">
//                 <div className="absolute inset-1 border-2 border-yellow-400 rounded-lg"></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}


//       {/* Engagement Metrics - Matching Figma */}
//       <div className="px-3 lg:px-4 py-3 lg:py-4 border-t border-gray-200 flex items-center gap-4 lg:gap-6">
//         <button 
//           onClick={handleLike}
//           className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
//         >
//           <Heart className={`w-5 h-5 ${liked ? 'fill-red-600 text-red-600' : ''}`} />
//           <span className="font-medium text-sm lg:text-base">{formatCount(likesCount)}</span>
//         </button>
//         <button 
//           onClick={() => onComment(post.id)}
//           className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
//         >
//           <MessageCircle className="w-5 h-5" />
//           <span className="font-medium text-sm lg:text-base">{formatCount(post.comments_count || 0)}</span>
//         </button>
//         <button 
//           onClick={() => onShare(post.id)}
//           className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
//         >
//           <Share2 className="w-5 h-5" />
//           <span className="font-medium text-sm lg:text-base">{formatCount(post.shares_count || 0)}</span>
//         </button>
//         <div className="flex items-center gap-2 text-gray-600">
//           <BarChart3 className="w-5 h-5" />
//           <span className="font-medium text-sm lg:text-base">{formatCount(post.views_count || 0)}</span>
//         </div>
//       </div>
//     </div>
//   )
// }



// pages/InstitutionDashboard.tsx
// import { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useAuthStore } from '../store/useAuthStore'
// import { useAppStore } from '../store/useAppStore'
// import { Heart, MessageCircle, Share2, BarChart3, MoreVertical } from 'lucide-react'
// import RightSidebar from '../components/RightSideBar'
// import { usePosts, usePostMutations,useFetchInstitutionPosts } from '../hooks/usePosts'
// import {useCurrentUser} from "../hooks/useAuth";

// export default function InstitutionDashboard() {
//   const navigate = useNavigate()
//   const { user } = useAuthStore()
//   const { selectedSchool } = useAppStore()


//   const { data: userData, isLoading:meIsLoading } = useCurrentUser()

//   const { mutate: fetchPosts, isPending, } = useFetchInstitutionPosts()

//   // Use the posts hook
//   // const {
//   //   data,
//   //   fetchNextPage,
//   //   hasNextPage,
//   //   isFetchingNextPage,
//   //   isLoading,
//   //   isError,
//   //   error,
//   // } = usePosts()
//   // Flatten posts from all pages
//   //const posts = data?.pages.flatMap(page => page.posts) || []

//   useEffect(()=>{

//   },[])

//   // Use post mutations
//   const { likePost, sharePost } = usePostMutations()



//   const loadMorePosts = () => {
//     if (hasNextPage && !isFetchingNextPage) {
//       fetchNextPage()
//     }
//   }

//   const formatCount = (count: number) => {
//     if (count >= 1000000) {
//       return (count / 1000000).toFixed(1) + 'M'
//     } else if (count >= 1000) {
//       return (count / 1000).toFixed(1) + 'k'
//     }
//     return count.toString()
//   }

//   const handleLike = (postId: string | number) => {
//     likePost.mutate(postId)
//   }

//   const handleComment = (postId: string | number) => {
//     navigate(`/posts/${postId}`)
//   }

//   const handleShare = (postId: string | number) => {
//     sharePost.mutate(postId)
//   }

//   // Loading skeleton
//   if (isLoading && posts.length === 0) {
//     return (
//       <div className="flex-1 flex flex-col lg:flex-row bg-white">
//         <div className="flex-1 overflow-y-auto w-full lg:w-auto">
//           <div className="max-w-3xl mx-auto p-3 sm:p-4 lg:p-6 pb-20 lg:pb-6">
//             {[...Array(2)].map((_, i) => (
//               <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 lg:mb-6 animate-pulse">
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
//     )
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
//     )
//   }

//   return (
//     <div className="flex-1 flex flex-col lg:flex-row bg-white">
//       {/* Main Content Area - Feed */}
//       <div className="flex-1 overflow-y-auto w-full lg:w-auto">
//         <div className="max-w-3xl mx-auto p-3 sm:p-4 lg:p-6 pb-20 lg:pb-6">
//           {posts.length === 0 && !isLoading ? (
//             <div className="text-center py-12">
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
//               <p className="text-gray-600">Create a post to engage with your community</p>
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
//                     {isFetchingNextPage ? 'Loading...' : 'Load More Posts'}
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
//   )
// }

// // Post Card Component matching Figma design
// const PostCard = ({ post, onLike, onComment, onShare, formatCount }: any) => {
//   const [liked, setLiked] = useState(post.liked || false)
//   const [likesCount, setLikesCount] = useState(post.likes_count || 0)

//   const handleLike = () => {
//     const newLiked = !liked
//     setLiked(newLiked)
//     setLikesCount((prev: number) => newLiked ? prev + 1 : prev - 1)
//     onLike(post.id)
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 lg:mb-6">
//       {/* Post Header */}
//       <div className="p-3 lg:p-4 flex items-start justify-between gap-2">
//         <div className="flex items-center gap-2 lg:gap-3 flex-1 min-w-0">
//           {/* Institution Avatar - Matching Figma (green background with white circle) */}
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
//                     {post.author?.full_name?.charAt(0) || 'U'}
//                   </span>
//                 </div>
//               </div>
//             )}
//           </div>
//           <div className="flex-1 min-w-0">
//             <h3 className="font-bold text-gray-900 text-sm lg:text-base truncate">
//               {post.author?.full_name || 'University of Lagos'}
//             </h3>
//             <p className="text-xs lg:text-sm text-gray-600 truncate">
//               {post.author?.address || post.author?.location || 'University Road Lagos Mainland Akoka, Yaba, Lagos'}
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

//       {/* Post Image */}
//       {post.media && post.media.length > 0 ? (
//         <div className="w-full">
//           <div className="w-full aspect-square max-h-[600px] overflow-hidden">
//             <img 
//               src={post.media[0].url} 
//               alt="Post content"
//               className="w-full h-full object-cover"
//               loading="lazy"
//             />
//           </div>
//         </div>
//       ) : (
//         <div className="w-full aspect-square max-h-[600px] overflow-hidden bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50 flex items-center justify-center relative">
//           {/* Academic Regalia Image Placeholder - Matching Figma design (second image) */}
//           <div className="relative w-full h-full flex items-center justify-center">
//             <div className="relative">
//               {/* Face/Head */}
//               <div className="w-32 h-32 lg:w-40 lg:h-40 mx-auto mb-2 bg-amber-200 rounded-full flex items-center justify-center shadow-lg relative z-10">
//                 <div className="w-24 h-24 lg:w-32 lg:h-32 bg-amber-300 rounded-full flex items-center justify-center">
//                   <span className="text-4xl lg:text-6xl">👩‍🎓</span>
//                 </div>
//               </div>
//               {/* Academic Cap (Maroon with gold band) */}
//               <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-28 lg:w-36 h-12 lg:h-16 bg-gradient-to-b from-red-800 to-red-900 rounded-t-full shadow-lg">
//                 <div className="absolute bottom-0 left-0 right-0 h-2 bg-yellow-500"></div>
//                 {/* Tassel */}
//                 <div className="absolute top-2 right-4 lg:right-6 w-1 h-6 lg:h-8 bg-yellow-400 rounded-full"></div>
//               </div>
//               {/* Academic Gown/Robe (Maroon with gold trim) */}
//               <div className="absolute top-24 lg:top-32 left-1/2 transform -translate-x-1/2 w-36 lg:w-48 h-32 lg:h-40 bg-gradient-to-b from-red-800 to-red-900 rounded-b-full shadow-xl">
//                 {/* Gold trim on gown */}
//                 <div className="absolute top-0 left-4 lg:left-6 right-4 lg:right-6 h-1 bg-yellow-500"></div>
//                 <div className="absolute bottom-8 left-4 lg:left-6 right-4 lg:right-6 h-1 bg-yellow-500"></div>
//               </div>
//               {/* Sash/Stole (Pink with gold trim) */}
//               <div className="absolute top-28 lg:top-36 left-1/2 transform -translate-x-1/2 w-32 lg:w-40 h-20 lg:h-24 bg-gradient-to-b from-pink-400 to-pink-500 rounded-lg shadow-lg">
//                 <div className="absolute inset-1 border-2 border-yellow-400 rounded-lg"></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Engagement Metrics - Matching Figma */}
//       <div className="px-3 lg:px-4 py-3 lg:py-4 border-t border-gray-200 flex items-center gap-4 lg:gap-6">
//         <button 
//           onClick={handleLike}
//           className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
//         >
//           <Heart className={`w-5 h-5 ${liked ? 'fill-red-600 text-red-600' : ''}`} />
//           <span className="font-medium text-sm lg:text-base">{formatCount(likesCount)}</span>
//         </button>
//         <button 
//           onClick={() => onComment(post.id)}
//           className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
//         >
//           <MessageCircle className="w-5 h-5" />
//           <span className="font-medium text-sm lg:text-base">{formatCount(post.comments_count || 0)}</span>
//         </button>
//         <button 
//           onClick={() => onShare(post.id)}
//           className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
//         >
//           <Share2 className="w-5 h-5" />
//           <span className="font-medium text-sm lg:text-base">{formatCount(post.shares_count || 0)}</span>
//         </button>
//         <div className="flex items-center gap-2 text-gray-600">
//           <BarChart3 className="w-5 h-5" />
//           <span className="font-medium text-sm lg:text-base">{formatCount(post.views_count || 0)}</span>
//         </div>
//       </div>
//     </div>
//   )
// }

// pages/InstitutionDashboard.tsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { Heart, MessageCircle, Share2, BarChart3, Loader2 } from 'lucide-react'
import RightSidebar from '../components/RightSideBar'
import { useFetchInstitutionPosts, usePostMutations } from '../hooks/usePosts'
import { useAppStore } from '../store/useAppStore'
import PostActionsMenu from '../components/PostActionsMenu'
import { canDeletePost } from '../utils/postPermissions'
import { requestOpenCreatePost } from '../utils/createPost'
import { requestAuthNotice } from '../utils/authNotice'
import { CREATE_POST_AUTH_NOTICE } from '../utils/authNoticeContent'
import { isUserSessionAuthenticated } from '../utils/sessionAuth'

export default function InstitutionLandingPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const { selectedSchool } = useAppStore();
  const canCreatePost = isUserSessionAuthenticated(isAuthenticated)

 // console.log(JSON.stringify(selectedSchool))

  // State for posts
  const [posts, setPosts] = useState<any[]>([])
  const [skip, setSkip] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [deletingPostId, setDeletingPostId] = useState<string | number | null>(
    null
  )

  // Use the mutation to fetch institution posts
  const { 
    mutate: fetchPosts, 
    isPending: isFetchingPosts, 
    data: postsData,
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

  const { deletePost } = usePostMutations()

  const handleCreatePostClick = () => {
    if (!canCreatePost) {
      requestAuthNotice(CREATE_POST_AUTH_NOTICE)
      return
    }

    requestOpenCreatePost()
  }

  // Extract institution ID from user data
  const institutionId = selectedSchool?.id //userData?.institution_profile?.id
  const institutionName = selectedSchool.name//userData?.institution_profile?.institution_name

  // Fetch posts when institution ID is available
  useEffect(() => {
    if (institutionId ) {
      fetchPosts({
        institution_id: institutionId,
        skip: 0,
        limit: 10,
        post_type: 'all'
      })
      setSkip(0) // Reset skip on initial load
    }
  }, [institutionId, fetchPosts])

  const loadMorePosts = () => {
    if (hasMore && institutionId && !isFetchingPosts) {
      const nextSkip = skip + 10
      fetchPosts({
        institution_id: institutionId,
        skip: nextSkip,
        limit: 10,
        post_type: 'all'
      })
      setSkip(nextSkip)
    }
  }

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M'
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k'
    }
    return count.toString()
  }

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
    // You would call your likePost mutation here
    // likePost.mutate(postId)
  }

  const handleComment = (postId: string | number) => {
    navigate(`/posts/${postId}`)
  }

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
    // You would call your sharePost mutation here
    // sharePost.mutate(postId)
  }

  const handleDelete = async (postId: string | number) => {
    const shouldDelete = window.confirm(
      'Delete this post? This action cannot be undone.'
    )

    if (!shouldDelete) return

    setDeletingPostId(postId)

    try {
      await deletePost.mutateAsync(postId)
      setPosts((prev) => prev.filter((post) => post.id !== postId))
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        'Failed to delete post. Please try again.'
      window.alert(message)
    } finally {
      setDeletingPostId(null)
    }
  }

  // Loading skeleton for user data
  if (isFetchingPosts) {
    return (
      <div className="flex-1 flex flex-col lg:flex-row bg-white">
        <div className="flex-1 overflow-y-auto w-full lg:w-auto">
          <div className="max-w-3xl mx-auto p-3 sm:p-4 lg:p-6 pb-20 lg:pb-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 lg:mb-6 animate-pulse">
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
    )
  }

  // Error handling for user data
  if (postsError) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white ">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error loading institution data
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
    )
  }

  // Check if user has institution profile
  if (!institutionId ) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Institution Profile Required
          </h3>
          <p className="text-gray-600 mb-6">
            Please complete your institution profile to view posts.
          </p>
          <button
            onClick={() => navigate('/complete-profile')}
            className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-800 transition-colors"
          >
            Complete Profile
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row bg-white">
      {/* Institution Header */}
      {/* {institutionName && (
        <div className="w-full bg-gradient-to-r from-primary-600 to-primary-800 p-4 lg:p-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl text-white font-bold">
                  {institutionName.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white">
                  {institutionName}
                </h1>
                <p className="text-white/90 mt-1">
                  Institution Dashboard
                </p>
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
                onClick={() => institutionId && fetchPosts({
                  institution_id: institutionId,
                  skip: 0,
                  limit: 10,
                  post_type: 'all'
                })}
                className="mt-2 text-sm text-primary-600 hover:text-primary-800 font-medium"
              >
                Try Again
              </button>
            </div>
          )}

          {posts.length === 0 && !isFetchingPosts ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600">Create your first post to engage with your community</p>
              <button
                onClick={handleCreatePostClick}
                className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-800 transition-colors"
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
                    You've seen all posts from {institutionName}
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
  )
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
  const [liked, setLiked] = useState(post.liked || false)
  const [likesCount, setLikesCount] = useState(post.likes_count || 0)

  const handleLike = () => {
    const newLiked = !liked
    setLiked(newLiked)
    setLikesCount((prev: number) => newLiked ? prev + 1 : prev - 1)
    onLike(post.id)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 lg:mb-6">
      {/* Post Header */}
      <div className="p-3 lg:p-4 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 lg:gap-3 flex-1 min-w-0">
          {/* Institution Avatar */}
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
                    {post.author?.full_name?.charAt(0) || 'U'}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-sm lg:text-base truncate">
              {post.author?.full_name || 'Institution'}
            </h3>
            <p className="text-xs lg:text-sm text-gray-600 truncate">
              {post.author?.address || post.author?.location || ''}
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

      {/* Post Media */}
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
          {/* Academic Regalia Image Placeholder */}
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative">
              {/* Face/Head */}
              <div className="w-32 h-32 lg:w-40 lg:h-40 mx-auto mb-2 bg-amber-200 rounded-full flex items-center justify-center shadow-lg relative z-10">
                <div className="w-24 h-24 lg:w-32 lg:h-32 bg-amber-300 rounded-full flex items-center justify-center">
                  <span className="text-4xl lg:text-6xl">👩‍🎓</span>
                </div>
              </div>
              {/* Academic Cap */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-28 lg:w-36 h-12 lg:h-16 bg-gradient-to-b from-red-800 to-red-900 rounded-t-full shadow-lg">
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-yellow-500"></div>
                <div className="absolute top-2 right-4 lg:right-6 w-1 h-6 lg:h-8 bg-yellow-400 rounded-full"></div>
              </div>
              {/* Academic Gown */}
              <div className="absolute top-24 lg:top-32 left-1/2 transform -translate-x-1/2 w-36 lg:w-48 h-32 lg:h-40 bg-gradient-to-b from-red-800 to-red-900 rounded-b-full shadow-xl">
                <div className="absolute top-0 left-4 lg:left-6 right-4 lg:right-6 h-1 bg-yellow-500"></div>
                <div className="absolute bottom-8 left-4 lg:left-6 right-4 lg:right-6 h-1 bg-yellow-500"></div>
              </div>
              {/* Sash/Stole */}
              <div className="absolute top-28 lg:top-36 left-1/2 transform -translate-x-1/2 w-32 lg:w-40 h-20 lg:h-24 bg-gradient-to-b from-pink-400 to-pink-500 rounded-lg shadow-lg">
                <div className="absolute inset-1 border-2 border-yellow-400 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Engagement Metrics */}
      <div className="px-3 lg:px-4 py-3 lg:py-4 border-t border-gray-200 flex flex-wrap items-center gap-x-4 gap-y-3 lg:gap-x-6">
        <button 
          onClick={handleLike}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
        >
          <Heart className={`w-5 h-5 ${liked ? 'fill-red-600 text-red-600' : ''}`} />
          <span className="font-medium text-sm lg:text-base">{formatCount(likesCount)}</span>
        </button>
        <button 
          onClick={() => onComment(post.id)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium text-sm lg:text-base">{formatCount(post.comments_count || 0)}</span>
        </button>
        <button 
          onClick={() => onShare(post.id)}
          className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
        >
          <Share2 className="w-5 h-5" />
          <span className="font-medium text-sm lg:text-base">{formatCount(post.shares_count || 0)}</span>
        </button>
        <div className="flex items-center gap-2 text-gray-600">
          <BarChart3 className="w-5 h-5" />
          <span className="font-medium text-sm lg:text-base">{formatCount(post.views_count || 0)}</span>
        </div>
      </div>
    </div>
  )
}
