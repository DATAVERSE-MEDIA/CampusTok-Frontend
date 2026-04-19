// import { useState } from 'react'
// import { Calendar, User, Heart, MessageCircle, Share2, BookOpen } from 'lucide-react'

// const blogPosts = [
//   {
//     id: 1,
//     title: '10 Tips for Surviving Your First Semester',
//     author: 'Sarah Johnson',
//     date: 'Dec 10, 2024',
//     category: 'Student Life',
//     content: 'Starting college can be overwhelming, but with these tips, you\'ll be ready to tackle your first semester like a pro...',
//     image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
//     likes: 42,
//     comments: 12
//   },
//   {
//     id: 2,
//     title: 'Campus Events This Month',
//     author: 'Campus Admin',
//     date: 'Dec 8, 2024',
//     category: 'Events',
//     content: 'Don\'t miss out on these exciting events happening around campus this month. From tech fairs to cultural festivals...',
//     image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
//     likes: 89,
//     comments: 24
//   },
//   {
//     id: 3,
//     title: 'Study Groups: How to Find Your Perfect Match',
//     author: 'Michael Chen',
//     date: 'Dec 5, 2024',
//     category: 'Academics',
//     content: 'Finding the right study group can make all the difference in your academic success. Here\'s how to find your perfect study partners...',
//     image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
//     likes: 156,
//     comments: 38
//   },
// ]

// export default function CampusBlog() {
//   const [selectedCategory, setSelectedCategory] = useState('All')
//   const categories = ['All', 'Student Life', 'Events', 'Academics', 'Sports', 'Culture']

//   return (
//     <div className="max-w-6xl mx-auto">
//       <div className="card mb-6">
//         <div className="flex items-center gap-3 mb-2">
//           <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
//             <BookOpen className="w-6 h-6 text-green-600" />
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Campus Blog</h1>
//             <p className="text-gray-600">Stories, tips, and updates from the campus community</p>
//           </div>
//         </div>
//       </div>

//       {/* Category Filter */}
//       <div className="mb-6 flex gap-2 flex-wrap">
//         {categories.map((category) => (
//           <button
//             key={category}
//             onClick={() => setSelectedCategory(category)}
//             className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//               selectedCategory === category
//                 ? 'bg-primary-600 text-white'
//                 : 'bg-white text-gray-700 hover:bg-gray-100'
//             }`}
//           >
//             {category}
//           </button>
//         ))}
//       </div>

//       {/* Blog Posts */}
//       <div className="space-y-6">
//         {blogPosts.map((post) => (
//           <article key={post.id} className="card hover:shadow-lg transition-shadow">
//             <div className="flex gap-6">
//               <div className="flex-1">
//                 <div className="flex items-center gap-2 mb-2">
//                   <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
//                     {post.category}
//                   </span>
//                   <span className="text-sm text-gray-500 flex items-center gap-1">
//                     <Calendar className="w-4 h-4" />
//                     {post.date}
//                   </span>
//                 </div>
//                 <h2 className="text-2xl font-bold text-gray-900 mb-3">{post.title}</h2>
//                 <p className="text-gray-600 mb-4">{post.content}</p>
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-4 text-gray-600">
//                     <div className="flex items-center gap-2">
//                       <User className="w-4 h-4" />
//                       <span className="text-sm">{post.author}</span>
//                     </div>
//                     <button className="flex items-center gap-2 hover:text-red-600 transition-colors">
//                       <Heart className="w-4 h-4" />
//                       <span>{post.likes}</span>
//                     </button>
//                     <button className="flex items-center gap-2 hover:text-primary-600 transition-colors">
//                       <MessageCircle className="w-4 h-4" />
//                       <span>{post.comments}</span>
//                     </button>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//                       <Share2 className="w-5 h-5 text-gray-600" />
//                     </button>
//                     <button className="btn-primary">Read More</button>
//                   </div>
//                 </div>
//               </div>
//               <div className="w-64 h-48 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
//                 <img
//                   src={post.image}
//                   alt={post.title}
//                   className="w-full h-full object-cover"
//                   onError={(e) => {
//                     e.target.style.display = 'none'
//                   }}
//                 />
//               </div>
//             </div>
//           </article>
//         ))}
//       </div>
//     </div>
//   )
// }

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  X,
  Plus,
  Image as ImageIcon,
  Send,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { useAuthStore } from "../store/useAuthStore";
import { apiClient } from "../api";
import { requestAuthNotice } from "../utils/authNotice";
import { CREATE_POST_AUTH_NOTICE } from "../utils/authNoticeContent";
import { isUserSessionAuthenticated } from "../utils/sessionAuth";
import {
  getInstitutionDisplayName,
  normalizeInstitutionRecord,
  resolveInstitutionFeedId,
} from "../utils/institutionContext";

/* =========================================================
   Institution blog API: /posts/institution/{id}?post_type=blog&skip=0&limit=100
   Schools: unilag, yabatech, ileife
========================================================= */

const PAGE_SIZE = 6;

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80";

function mapBlogFromApi(post) {
  const images =
    post.media?.filter((m) => m.media_type === "image")?.map((m) => m.url) ??
    [];
  return {
    id: post.id,
    author: post.author?.full_name ?? "Unknown",
    time: post.created_at
      ? new Date(post.created_at).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Recently",
    content: typeof post.content === "string" ? post.content : "",
    images: images.length ? images : [FALLBACK_IMAGE],
    likes: post.likes_count ?? 0,
    comments: post.comments_count ?? 0,
    shares: post.shares_count ?? 0,
  };
}

/* -------------------- Helpers -------------------- */

const safeId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const avatarFor = (name) =>
  `https://i.pravatar.cc/80?u=${encodeURIComponent(name)}`; // dummy profile images

const REACTIONS = [
  { key: "like", label: "Like", emoji: "👍" },
  { key: "love", label: "Love", emoji: "❤️" },
  { key: "haha", label: "Haha", emoji: "😂" },
  { key: "wow", label: "Wow", emoji: "😮" },
  { key: "sad", label: "Sad", emoji: "😢" },
  { key: "angry", label: "Angry", emoji: "😡" },
];

/* -------------------- Mock Data -------------------- */

const MOCK_SOURCE = [
  {
    id: "1",
    author: "Melody G.",
    time: "2 days ago",
    content:
      "The University of Lagos (UNILAG) has announced the upcoming launch of its Innovation and Entrepreneurship Hub, designed to empower students with hands-on experience in technology, research, and business development...",
    images: [
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    ],
    likes: 100,
    comments: 20,
    shares: 5,
  },
  {
    id: "2",
    author: "Jolextom",
    time: "10 days ago",
    content:
      "The University of Lagos (UNILAG) has announced the upcoming launch of its Innovation and Entrepreneurship Hub, designed to empower students with hands-on experience in technology, research, and business development...",
    images: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    ],
    likes: 100,
    comments: 20,
    shares: 5,
  },
  {
    id: "3",
    author: "Sarah Johnson",
    time: "12 days ago",
    content:
      "New campus facilities are opening this semester — study lounges, maker spaces, and more. Here’s what students can expect and how to access the spaces...",
    images: [
      "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?auto=format&fit=crop&w=1200&q=80",
    ],
    likes: 64,
    comments: 9,
    shares: 2,
  },
  {
    id: "4",
    author: "Campus Admin",
    time: "2 weeks ago",
    content:
      "Don’t miss out on campus events this month: tech fairs, cultural festivals, and sports nights. Save the dates and invite your friends!",
    images: [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    ],
    likes: 89,
    comments: 24,
    shares: 6,
  },
  {
    id: "5",
    author: "Michael Chen",
    time: "3 weeks ago",
    content:
      "Study groups: how to find the right people, set expectations, and keep the momentum. Here are practical strategies that actually work...",
    images: [
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
    ],
    likes: 156,
    comments: 38,
    shares: 11,
  },
  {
    id: "6",
    author: "Tomiwa A.",
    time: "1 month ago",
    content:
      "If you’re trying to balance school with side projects, here are the routines and tools that helped me stop procrastinating and start shipping work.",
    images: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    ],
    likes: 77,
    comments: 13,
    shares: 4,
  },
];

/* =========================================================
   Component
========================================================= */

export default function CampusBlog() {
  const { selectedSchool, contentSchool } = useAppStore();
  const { isAuthenticated, userType } = useAuthStore();
  const feedSchool =
    userType === "institution" ? contentSchool || selectedSchool : selectedSchool;
  const browseInstitution = normalizeInstitutionRecord(feedSchool);
  const browseInstitutionName = getInstitutionDisplayName(
    browseInstitution,
    "Campus feed",
  );
  const institutionId = resolveInstitutionFeedId(feedSchool);
  const canCreatePost = isUserSessionAuthenticated(isAuthenticated);

  const [posts, setPosts] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [openComments, setOpenComments] = useState(null);

  // reactions map: postId -> { key, emoji }
  const [myReaction, setMyReaction] = useState({});
  const [reactionPickerFor, setReactionPickerFor] = useState(null);

  // API only: loading, error, hasMore
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  // lightbox
  const [lightbox, setLightbox] = useState(null); // { images, index, author }

  // create post modal
  const [createOpen, setCreateOpen] = useState(false);
  const [newAuthor, setNewAuthor] = useState("Melody G.");
  const [newContent, setNewContent] = useState("");
  const [newImage1, setNewImage1] = useState("");
  const [newImage2, setNewImage2] = useState("");

  const inflightRef = useRef(false);

  const handleCreatePostClick = () => {
    if (!canCreatePost) {
      requestAuthNotice(CREATE_POST_AUTH_NOTICE);
      return;
    }

    setCreateOpen(true);
  };

  /* -------------------- Fetch blogs from institution API only -------------------- */
  const fetchBlogs = useCallback(async () => {
    if (inflightRef.current) return;
    inflightRef.current = true;
    setLoading(true);
    setFetchError(null);

    try {
      const params = { post_type: "blog", skip: 0, limit: 100 };
      const response = await apiClient.get(
        `/posts/institution/${institutionId}`,
        { params }
      );
      const raw = response.data?.data ?? response.data ?? [];
      const list = Array.isArray(raw) ? raw : [];
      const blogsOnly = list.filter((p) => p.post_type === "blog");
      const mapped = blogsOnly.map(mapBlogFromApi);

      setPosts(mapped);
      setHasMore(false);
    } catch (e) {
      console.error(e);
      setFetchError(e.message || "Failed to load blog posts");
      setPosts([]);
      setHasMore(false);
    } finally {
      setLoading(false);
      inflightRef.current = false;
    }
  }, [institutionId]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const applyReaction = (postId, reaction) => {
    setMyReaction((prev) => ({ ...prev, [postId]: reaction }));
    setReactionPickerFor(null);
  };

  /* =========================================================
     Create post modal logic
  ========================================================= */
  const createPost = () => {
    const images = [newImage1.trim(), newImage2.trim()].filter(Boolean);
    const post = {
      id: safeId(),
      author: newAuthor.trim() || "Anonymous",
      time: "Just now",
      content: newContent.trim() || "—",
      images: images.length ? images : [FALLBACK_IMAGE],
      likes: 0,
      comments: 0,
      shares: 0,
    };

    setPosts((prev) => [post, ...prev]);
    setCreateOpen(false);
    setNewContent("");
    setNewImage1("");
    setNewImage2("");
  };

  /* -------------------- Render helpers -------------------- */

  const getLikeDisplay = (post) => {
    const r = myReaction[post.id];
    if (!r) return { text: String(post.likes), emoji: null };
    // Add +1 optimistically when reacted
    return { text: String(post.likes + 1), emoji: r.emoji };
  };

  const openLightbox = (post, index) => {
    setLightbox({ images: post.images, index, author: post.author });
  };

  const nextLightbox = () => {
    setLightbox((prev) => {
      if (!prev) return prev;
      const next = (prev.index + 1) % prev.images.length;
      return { ...prev, index: next };
    });
  };

  const prevLightbox = () => {
    setLightbox((prev) => {
      if (!prev) return prev;
      const next = (prev.index - 1 + prev.images.length) % prev.images.length;
      return { ...prev, index: next };
    });
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Campus Feed</h1>
          {browseInstitution && (
            <p className="mt-1 text-sm text-gray-500">
              Showing blog posts from{" "}
              <span className="font-medium text-gray-700">
                {browseInstitutionName}
              </span>
            </p>
          )}
        </div>

        <button
          onClick={handleCreatePostClick}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition"
        >
          <Plus className="w-4 h-4" />
          New Post
        </button>
      </div>

      {browseInstitution && (
        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {userType === "institution"
              ? "Browse Institution Posts"
              : "Selected Institution"}
          </p>
          <div className="mt-1 flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-gray-900">
                {browseInstitutionName}
              </p>
              {browseInstitution.address && (
                <p className="text-sm text-gray-500">
                  {browseInstitution.address}
                </p>
              )}
            </div>
            {browseInstitution.code && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-gray-600">
                {browseInstitution.code}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Error: failed to load */}
      {!loading && fetchError && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-gray-700 font-medium mb-1">Could not load posts</p>
          <p className="text-sm text-gray-500 mb-4">{fetchError}</p>
          <p className="text-sm text-gray-600 mb-4">
            Try refreshing or check back later.
          </p>
          <button
            onClick={() => fetchBlogs()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      )}

      {/* Empty: no data from API */}
      {!loading && !fetchError && posts.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-gray-700 font-medium mb-1">
            No data at the moment
          </p>
          <p className="text-sm text-gray-500 mb-4">
            There are no blog posts to show. Try refreshing or check back later.
          </p>
          <button
            onClick={() => fetchBlogs()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      )}

      {/* Feed */}
      {!loading &&
        posts.length > 0 &&
        posts.map((post) => {
          const isExpanded = expanded[post.id];
          const likeDisplay = getLikeDisplay(post);

          return (
            <article key={post.id} className="bg-white rounded-2xl shadow p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={avatarFor(post.author)}
                    alt={post.author}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/80";
                    }}
                  />
                  <p className="text-sm font-semibold uppercase text-gray-900">
                    Posted by {post.author}
                  </p>
                </div>

                <span className="text-sm text-gray-500 uppercase">
                  {post.time}
                </span>
              </div>

              {/* Content + Read more */}
              <p className="text-gray-700 mb-2 leading-relaxed">
                {isExpanded ? post.content : post.content.slice(0, 140)}
                {post.content.length > 140 && (
                  <button
                    onClick={() =>
                      setExpanded((p) => ({ ...p, [post.id]: !p[post.id] }))
                    }
                    className="ml-2 text-blue-600 text-sm font-medium"
                  >
                    {isExpanded ? "Show less" : "Read more"}
                  </button>
                )}
              </p>

              {/* 2) Single image vs collage logic */}
              {post.images?.length === 1 ? (
                <button
                  type="button"
                  onClick={() => openLightbox(post, 0)}
                  className="block w-full mt-4"
                  aria-label="Open image"
                >
                  <img
                    src={post.images[0]}
                    alt=""
                    className="w-full h-72 object-cover rounded-xl"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {post.images.slice(0, 2).map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => openLightbox(post, i)}
                      className="block w-full"
                      aria-label="Open image"
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-56 object-cover rounded-xl"
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_IMAGE;
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Engagement row */}
              <div className="flex items-center gap-6 text-gray-600 mt-4 relative">
                {/* 3) Emoji reactions + 5) Like animation */}
                <div
                  className="relative"
                  onMouseLeave={() => setReactionPickerFor(null)}
                >
                  <button
                    onClick={() =>
                      setReactionPickerFor((p) =>
                        p === post.id ? null : post.id
                      )
                    }
                    className={`flex items-center gap-2 transition active:scale-95 ${
                      myReaction[post.id]
                        ? "text-red-600"
                        : "hover:text-red-600"
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        myReaction[post.id] ? "fill-red-600" : ""
                      }`}
                    />
                    <span className="flex items-center gap-1">
                      {likeDisplay.emoji && (
                        <span className="text-base">{likeDisplay.emoji}</span>
                      )}
                      {likeDisplay.text}
                    </span>
                  </button>

                  {/* Reaction picker */}
                  {reactionPickerFor === post.id && (
                    <div className="absolute -top-14 left-0 bg-white shadow rounded-full px-3 py-2 flex gap-2 border">
                      {REACTIONS.map((r) => (
                        <button
                          key={r.key}
                          onClick={() => applyReaction(post.id, r)}
                          className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-lg transition active:scale-95"
                          title={r.label}
                        >
                          {r.emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Comments */}
                <button
                  onClick={() => setOpenComments(post.id)}
                  className="flex items-center gap-2 hover:text-blue-600 transition active:scale-95"
                >
                  <MessageCircle className="w-5 h-5" />
                  {post.comments}
                </button>

                {/* Share */}
                <button className="flex items-center gap-2 hover:text-green-600 transition active:scale-95">
                  <Share2 className="w-5 h-5" />
                  {post.shares}
                </button>
              </div>
            </article>
          );
        })}

      {!hasMore && posts.length > 0 && (
        <div className="text-center text-sm text-gray-500 py-6">
          You’ve reached the end.
        </div>
      )}

      {/* =========================================================
          Comment drawer UI
      ========================================================= */}
      {openComments && (
        <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
          <div className="w-full max-w-md bg-white h-full p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Comments</h3>
              <button onClick={() => setOpenComments(null)}>
                <X />
              </button>
            </div>

            <div className="space-y-3">
              {[1, 2, 3].map((c) => (
                <div key={c} className="bg-gray-100 rounded-lg p-3 text-sm">
                  This is a sample comment.
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <input
                placeholder="Write a comment..."
                className="flex-1 border rounded-lg px-3 py-2"
              />
              <button className="px-3 py-2 rounded-lg bg-gray-900 text-white">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          4) Image lightbox
      ========================================================= */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            <div className="flex items-center justify-between text-white mb-3">
              <div className="text-sm opacity-90">
                {lightbox.author} • {lightbox.index + 1}/
                {lightbox.images.length}
              </div>
              <button
                onClick={() => setLightbox(null)}
                className="p-2 rounded-lg hover:bg-white/10"
              >
                <X className="text-white" />
              </button>
            </div>

            <div className="relative bg-black rounded-xl overflow-hidden">
              <img
                src={lightbox.images[lightbox.index]}
                alt=""
                className="w-full max-h-[75vh] object-contain bg-black"
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
              />

              {lightbox.images.length > 1 && (
                <>
                  <button
                    onClick={prevLightbox}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center"
                  >
                    <ChevronLeft className="text-white" />
                  </button>

                  <button
                    onClick={nextLightbox}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center"
                  >
                    <ChevronRight className="text-white" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          5) Post creation modal
      ========================================================= */}
      {createOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Create Post</h3>
              <button onClick={() => setCreateOpen(false)}>
                <X />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-700 font-medium">
                  Author
                </label>
                <input
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 font-medium">
                  Content
                </label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="mt-1 w-full border rounded-lg px-3 py-2 min-h-[110px]"
                  placeholder="What’s happening?"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-700 font-medium flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> Image URL 1
                  </label>
                  <input
                    value={newImage1}
                    onChange={(e) => setNewImage1(e.target.value)}
                    className="mt-1 w-full border rounded-lg px-3 py-2"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700 font-medium flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> Image URL 2 (optional)
                  </label>
                  <input
                    value={newImage2}
                    onChange={(e) => setNewImage2(e.target.value)}
                    className="mt-1 w-full border rounded-lg px-3 py-2"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setCreateOpen(false)}
                className="px-4 py-2 rounded-xl border hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={createPost}
                className="px-4 py-2 rounded-xl bg-gray-900 text-white hover:bg-gray-800"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
