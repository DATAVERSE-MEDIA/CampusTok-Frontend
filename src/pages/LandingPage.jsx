// import { useNavigate } from 'react-router-dom'
// import { useAppStore } from '../store/useAppStore'
// import { Heart, MessageCircle, Share2, BarChart3, MoreVertical } from 'lucide-react'

// export default function LandingPage() {
//   const navigate = useNavigate()
//   const { selectedSchool } = useAppStore()

//   return (
//     <div className="flex-1 flex bg-white">
//       {/* Main Content Area */}
//       <div className="flex-1 overflow-y-auto">
//         <div className="max-w-3xl mx-auto p-6">
//           {/* Post */}
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
//             {/* Post Header */}
//             <div className="p-4 flex items-start justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center relative">
//                   <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
//                     <span className="text-green-600 font-bold text-lg">U</span>
//                   </div>
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-gray-900">
//                     {selectedSchool ? selectedSchool.name : 'University of Lagos'}
//                   </h3>
//                   <p className="text-sm text-gray-600">
//                     {selectedSchool?.address || 'University Road Lagos Mainland Akoka, Yaba, Lagos'}
//                   </p>
//                 </div>
//               </div>
//               <button className="p-2 hover:bg-gray-100 rounded-full">
//                 <MoreVertical className="w-5 h-5 text-gray-400" />
//               </button>
//             </div>

//             {/* Post Text */}
//             <div className="px-4 pb-4">
//               <p className="text-gray-900 leading-relaxed">
//                 At the University of Lagos, a new electric bus was introduced to shuttle students around campus. 
//                 Silent and eco-friendly, it quickly became a symbol of innovation, inspiring students wh...
//               </p>
//             </div>

//             {/* Post Image */}
//             <div className="w-full">
//               <div className="w-full h-[600px] bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center relative overflow-hidden">
//                 {/* Placeholder for the academic regalia image - you can replace this with actual image */}
//                 <div className="w-full h-full flex items-center justify-center bg-amber-50">
//                   <div className="text-center">
//                     <div className="w-40 h-40 mx-auto mb-4 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
//                       <span className="text-7xl">👩‍🎓</span>
//                     </div>
//                     <p className="text-gray-600 text-sm">Academic Regalia - University of Lagos</p>
//                     <p className="text-gray-500 text-xs mt-2">Replace with actual image from your assets</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Engagement Metrics */}
//             <div className="px-4 py-4 border-t border-gray-200 flex items-center gap-6">
//               <button className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
//                 <Heart className="w-5 h-5" />
//                 <span className="font-medium">11.7k</span>
//               </button>
//               <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
//                 <MessageCircle className="w-5 h-5" />
//                 <span className="font-medium">500</span>
//               </button>
//               <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors">
//                 <Share2 className="w-5 h-5" />
//                 <span className="font-medium">1k</span>
//               </button>
//               <button className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
//                 <BarChart3 className="w-5 h-5" />
//                 <span className="font-medium">100k</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Right Sidebar - Chatbot Widget */}
//       <div className="w-80 bg-gray-900 p-6 flex items-start">
//         <div className="bg-gray-800 rounded-lg p-6 w-full">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
//               <span className="text-white text-xl">🤖</span>
//             </div>
//             <div>
//               <h3 className="font-bold text-white">HI, I'm ChatBot</h3>
//             </div>
//           </div>
//           <p className="text-gray-300 text-sm mb-6">
//             You can ask me questions based on a particular institution.
//           </p>
//           <button
//             onClick={() => navigate('/chatbot')}
//             className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
//           >
//             Use ChatBot
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }


import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { Heart, MessageCircle, Share2, BarChart3, MoreVertical, User } from 'lucide-react'
import { useState, useEffect } from 'react'
import { apiClient } from '../api'

export default function LandingPage() {
  const navigate = useNavigate()
  const { selectedSchool } = useAppStore()
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // Fetch posts based on selected school
  useEffect(() => {
    fetchPosts()
  }, [selectedSchool, page])

  const fetchPosts = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const params = {
        page,
        limit: 10,
        sortBy: 'created_at',
        sortOrder: 'desc'
      }

      // If a school is selected, filter by school
      if (selectedSchool?.id) {
        params.filters = { school_id: selectedSchool.id }
      }

      const response = await apiClient.get('/posts', { params })
      const newPosts = response.data.data || response.data
      
      if (page === 1) {
        setPosts(newPosts)
      } else {
        setPosts(prev => [...prev, ...newPosts])
      }
      
      // Check if there are more posts
      setHasMore(newPosts.length > 0)
    } catch (err) {
      console.error('Error fetching posts:', err)
      // Use dummy data for testing matching Figma
      const dummyPost = {
        id: 1,
        content: "At the University of Lagos, a new electric bus was introduced to shuttle students around campus. Silent and eco-friendly, it quickly became a symbol of innovation, inspiring students wh...",
        author: {
          full_name: "University of Lagos",
          profile_picture: null,
          role: "institution",
          address: "University Road Lagos Mainland Akoka, Yaba, Lagos"
        },
        media_url: null,
        likes_count: 11700,
        comments_count: 500,
        shares_count: 1000,
        views_count: 100000,
        created_at: new Date().toISOString()
      }
      if (page === 1) {
        setPosts([dummyPost])
      }
      setError(null) // Don't show error, use dummy data
    } finally {
      setIsLoading(false)
    }
  }

  const loadMorePosts = () => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      })
    }
  }

  // Handle post engagement
  const handleLike = async (postId) => {
    try {
      await apiClient.post(`/posts/${postId}/like`)
      // Update local state
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, likes_count: (post.likes_count || 0) + 1, liked: true }
          : post
      ))
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const handleComment = (postId) => {
    // Navigate to comments or open comment modal
    console.log('Open comments for post:', postId)
  }

  const handleShare = async (postId) => {
    try {
      await apiClient.post(`/posts/${postId}/share`)
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, shares_count: (post.shares_count || 0) + 1 }
          : post
      ))
    } catch (error) {
      console.error('Error sharing post:', error)
    }
  }

  // Loading skeleton
  if (isLoading && posts.length === 0) {
    return (
      <div className="flex-1 flex flex-col lg:flex-row bg-white">
        <div className="flex-1 overflow-y-auto w-full lg:w-auto">
          <div className="max-w-3xl mx-auto p-3 sm:p-4 lg:p-6 pb-20 lg:pb-6">
            {[...Array(3)].map((_, i) => (
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

  return (
    <div className="flex-1 flex flex-col lg:flex-row bg-white">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto w-full lg:w-auto">
        <div className="max-w-3xl mx-auto p-3 sm:p-4 lg:p-6 pb-20 lg:pb-6">
          {/* Welcome Header */}
          <div className="mb-4 lg:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {selectedSchool ? `${selectedSchool.name} Feed` : 'Campus Feed'}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              {selectedSchool 
                ? `Latest posts from ${selectedSchool.name} community`
                : 'Discover posts from campuses nationwide'
              }
            </p>
          </div>

          {/* Posts */}
          {posts.length === 0 && !isLoading ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <User className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600">
                {selectedSchool 
                  ? `Be the first to post in ${selectedSchool.name}`
                  : 'Follow schools or create a post to get started'
                }
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
                  formatDate={formatDate}
                />
              ))}
              
              {/* Load More Button */}
              {hasMore && (
                <div className="text-center mt-6">
                  <button
                    onClick={loadMorePosts}
                    disabled={isLoading}
                    className="btn-primary px-6 py-2 rounded-lg disabled:opacity-50"
                  >
                    {isLoading ? 'Loading...' : 'Load More Posts'}
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
  )
}

// Post Card Component
const PostCard = ({ post, onLike, onComment, onShare, formatDate }) => {
  const [liked, setLiked] = useState(post.liked || false)
  const [likesCount, setLikesCount] = useState(post.likes_count || 0)

  const formatCount = (count) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M'
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k'
    }
    return count.toString()
  }

  const handleLike = () => {
    const newLiked = !liked
    setLiked(newLiked)
    setLikesCount(prev => newLiked ? prev + 1 : prev - 1)
    if (newLiked) {
      onLike(post.id)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 lg:mb-6">
      {/* Post Header - Matching Figma */}
      <div className="p-3 lg:p-4 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 lg:gap-3 flex-1 min-w-0">
          {/* Institution Avatar - Matching Figma (green background with white circle) */}
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
              {post.author?.full_name || 'University of Lagos'}
            </h3>
            <p className="text-xs lg:text-sm text-gray-600 truncate">
              {post.author?.address || post.author?.location || 'University Road Lagos Mainland Akoka, Yaba, Lagos'}
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

      {/* Post Image/Media - Using academic regalia placeholder */}
      {post.media_url ? (
        <div className="w-full">
          <div className="w-full aspect-square max-h-[600px] overflow-hidden">
            <img 
              src={post.media_url} 
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

// Right Sidebar Component - Matching Figma (white background with border)
const RightSidebar = ({ navigate }) => (
  <div className="w-full bg-white p-4 lg:p-6 flex items-start sticky top-0 h-fit">
    <div className="border border-gray-200 rounded-lg p-4 lg:p-6 w-full bg-white">
      <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
        <div className="w-10 h-10 lg:w-20 lg:h-20 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-lg lg:text-xl ">
             <img src="https://res.cloudinary.com/ddcfjn03w/image/upload/v1768467101/chatbot/chatbot%20icon.png" className=''/>
          </span>
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-sm lg:text-base">HI, I'm ChatBot</h3>
        </div>
      </div>
      <p className="text-gray-600 text-xs lg:text-sm mb-4 lg:mb-6 leading-relaxed">
        You can ask me questions based on a particular institution.
      </p>
      <button
        onClick={() => navigate('/chatbot')}
        className="w-full bg-gray-700 hover:bg-gray-800 text-white py-2.5 lg:py-3 rounded-lg font-medium transition-colors text-sm lg:text-base"
      >
        Use ChatBot
      </button>
    </div>
  </div>
)