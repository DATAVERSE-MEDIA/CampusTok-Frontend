import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { useAppStore } from '../store/useAppStore'
import { Heart, MessageCircle, Share2, MoreVertical, UserPlus } from 'lucide-react'
import { apiClient } from '../api'

export default function GeneralDashboard() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { selectedSchool } = useAppStore()
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [following, setFollowing] = useState(new Set())

  // Fetch posts for general dashboard
  useEffect(() => {
    fetchPosts()
  }, [selectedSchool, page])

  const fetchPosts = async () => {
    setIsLoading(true)
    
    try {
      const params = {
        page,
        limit: 10,
        sortBy: 'created_at',
        sortOrder: 'desc'
      }

      if (selectedSchool?.id) {
        params.filters = { school_id: selectedSchool.id }
      }

      const response = await apiClient.get('/posts', { params })
      const newPosts = response.data.data || response.data || []
      
      // For testing: use dummy data matching Figma design
      if (newPosts.length === 0 && page === 1) {
        setPosts([
          {
            id: 1,
            content: "When people talk about university, they often focus only on GPAs, exams, and deadlines. But real growth happens outside the classroom. It's in the late-night study sessions where friendships form, in the student clubs where leadership skills emerge, and in the moments when you step out of your comfort zone to try something new. These experiences shape who you become, not just as a student, but as a person ready to make an impact in the world.",
            author: {
              full_name: "Farinloye Joseph",
              profile_picture: null,
              role: "student",
              school: "University of Lagos",
              department: "Marine Engineering",
              level: "100L"
            },
            media_url: null, // Will show lecture hall placeholder
            likes_count: 100,
            comments_count: 20,
            shares_count: 5,
            created_at: new Date().toISOString()
          },
          {
            id: 2,
            content: "The beauty of campus life is in its diversity. Every day, you meet people from different backgrounds, cultures, and perspectives. This melting pot of ideas and experiences is what makes university truly transformative. Embrace it, learn from it, and let it broaden your horizons.",
            author: {
              full_name: "Olawale Francis",
              profile_picture: null,
              role: "student",
              school: "University of Lagos",
              department: "Civil Engineering",
              level: "300L"
            },
            media_url: null,
            likes_count: 85,
            comments_count: 15,
            shares_count: 3,
            created_at: new Date(Date.now() - 3600000).toISOString()
          }
        ])
        setIsLoading(false)
        return
      }
      
      if (page === 1) {
        setPosts(newPosts)
      } else {
        setPosts(prev => [...prev, ...newPosts])
      }
      
      setHasMore(newPosts.length >= 10)
    } catch (err) {
      console.error('Error fetching posts:', err)
      // Use dummy data for testing matching Figma
      setPosts([
        {
          id: 1,
          content: "When people talk about university, they often focus only on GPAs, exams, and deadlines. But real growth happens outside the classroom. It's in the late-night study sessions where friendships form, in the student clubs where leadership skills emerge, and in the moments when you step out of your comfort zone to try something new. These experiences shape who you become, not just as a student, but as a person ready to make an impact in the world.",
          author: {
            full_name: "Farinloye Joseph",
            profile_picture: null,
            role: "student",
            school: "University of Lagos",
            department: "Marine Engineering",
            level: "100L"
          },
          media_url: null,
          likes_count: 100,
          comments_count: 20,
          shares_count: 5,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          content: "The beauty of campus life is in its diversity. Every day, you meet people from different backgrounds, cultures, and perspectives. This melting pot of ideas and experiences is what makes university truly transformative. Embrace it, learn from it, and let it broaden your horizons.",
          author: {
            full_name: "Olawale Francis",
            profile_picture: null,
            role: "student",
            school: "University of Lagos",
            department: "Civil Engineering",
            level: "300L"
          },
          media_url: null,
          likes_count: 85,
          comments_count: 15,
          shares_count: 3,
          created_at: new Date(Date.now() - 3600000).toISOString()
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const loadMorePosts = () => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1)
    }
  }

  const handleLike = async (postId) => {
    try {
      await apiClient.post(`/posts/${postId}/like`)
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, likes_count: (post.likes_count || 0) + 1, liked: true }
          : post
      ))
    } catch (error) {
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, likes_count: (post.likes_count || 0) + 1, liked: true }
          : post
      ))
    }
  }

  const handleComment = (postId) => {
    navigate(`/posts/${postId}`)
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
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, shares_count: (post.shares_count || 0) + 1 }
          : post
      ))
    }
  }

  const handleFollow = (authorId) => {
    setFollowing(prev => {
      const newSet = new Set(prev)
      if (newSet.has(authorId)) {
        newSet.delete(authorId)
      } else {
        newSet.add(authorId)
      }
      return newSet
    })
  }

  // Loading skeleton
  if (isLoading && posts.length === 0) {
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

  return (
    <div className="flex-1 flex flex-col lg:flex-row bg-white">
      {/* Main Content Area - Feed */}
      <div className="flex-1 overflow-y-auto w-full lg:w-auto">
        <div className="max-w-3xl mx-auto p-3 sm:p-4 lg:p-6 pb-20 lg:pb-6">
          {posts.length === 0 && !isLoading ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600">Create an account to start posting and engaging</p>
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
                  onFollow={handleFollow}
                  isFollowing={following.has(post.author?.id || post.id)}
                />
              ))}
              
              {hasMore && (
                <div className="text-center mt-6">
                  <button
                    onClick={loadMorePosts}
                    disabled={isLoading}
                    className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-800 transition-colors disabled:opacity-50"
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

// Post Card Component matching Figma design
const PostCard = ({ post, onLike, onComment, onShare, onFollow, isFollowing }) => {
  const [liked, setLiked] = useState(post.liked || false)
  const [likesCount, setLikesCount] = useState(post.likes_count || 0)

  const handleLike = () => {
    const newLiked = !liked
    setLiked(newLiked)
    setLikesCount(prev => newLiked ? prev + 1 : prev - 1)
    if (newLiked) {
      onLike(post.id)
    }
  }

  const authorName = post.author?.full_name || 'Anonymous'
  const authorDetails = post.author?.level && post.author?.department 
    ? `${post.author.school || 'University of Lagos'} | ${post.author.level} ${post.author.department}`
    : post.author?.school || 'University of Lagos'

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 lg:mb-6">
      {/* Post Header - Matching Figma */}
      <div className="p-3 lg:p-4 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 lg:gap-3 flex-1 min-w-0">
          {/* Author Profile Picture */}
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            {post.author?.profile_picture ? (
              <img 
                src={post.author.profile_picture} 
                alt={authorName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-500">
                <span className="text-white font-bold text-sm lg:text-base">
                  {authorName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-sm lg:text-base truncate">{authorName}</h3>
            <p className="text-xs lg:text-sm text-gray-600 truncate">{authorDetails}</p>
          </div>
        </div>
        {/* Follow Button - Matching Figma */}
        <button
          onClick={() => onFollow(post.author?.id || post.id)}
          className={`px-4 py-1.5 lg:py-2 rounded-lg font-medium text-xs lg:text-sm transition-colors flex-shrink-0 ${
            isFollowing
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              : 'bg-primary text-white hover:bg-primary-800'
          }`}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      </div>

      {/* Post Content */}
      <div className="px-3 lg:px-4 pb-3 lg:pb-4">
        <p className="text-sm lg:text-base text-gray-900 leading-relaxed whitespace-pre-line break-words">
          {post.content}
        </p>
      </div>

      {/* Post Media - Lecture Hall Image Placeholder */}
      {post.media  && post.media.length >0  ? (
        <div className="w-full">
          <div className="w-full aspect-video max-h-[600px] overflow-hidden">
            <img 
              src={post.media[0].url} 
              alt="Post content"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      ) : (
        <div className="w-full aspect-video max-h-[600px] overflow-hidden bg-gray-100 flex items-center justify-center">
          {/* Lecture Hall Placeholder - Matching Figma */}
          <div className="w-full h-full bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50 relative">
            {/* Lecture Hall Visual Representation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-4">
                {/* Chairs rows */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-8 h-8 bg-amber-700 rounded-sm shadow-md"></div>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-8 h-8 bg-amber-800 rounded-sm shadow-md"></div>
                  ))}
                </div>
                {/* Screen/Board */}
                <div className="w-64 h-32 mx-auto mt-4 bg-white rounded-lg shadow-xl border-4 border-gray-800 flex items-center justify-center">
                  <div className="w-56 h-24 bg-gray-100 rounded border-2 border-gray-300"></div>
                </div>
                <p className="text-gray-600 text-xs mt-4 font-medium">Lecture Hall</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Engagement Metrics - Matching Figma (NO views metric) */}
      <div className="px-3 lg:px-4 py-3 lg:py-4 border-t border-gray-200 flex items-center gap-4 lg:gap-6">
        <button 
          onClick={handleLike}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
        >
          <Heart className={`w-5 h-5 ${liked ? 'fill-red-600 text-red-600' : ''}`} />
          <span className="font-medium text-sm lg:text-base">{likesCount}</span>
        </button>
        <button 
          onClick={() => onComment(post.id)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium text-sm lg:text-base">{post.comments_count || 0}</span>
        </button>
        <button 
          onClick={() => onShare(post.id)}
          className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
        >
          <Share2 className="w-5 h-5" />
          <span className="font-medium text-sm lg:text-base">{post.shares_count || 0}</span>
        </button>
      </div>
    </div>
  )
}

// Right Sidebar - ChatBot Component matching Figma (light gray background)
const RightSidebar = ({ navigate }) => (
  <div className="w-full bg-white p-4 lg:p-6 flex items-start sticky top-0 h-fit">
    <div className="bg-gray-100 rounded-lg p-4 lg:p-6 w-full border border-gray-200">
      <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-lg lg:text-xl">🤖</span>
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
