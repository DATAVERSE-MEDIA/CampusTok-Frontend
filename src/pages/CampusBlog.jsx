import { useState } from 'react'
import { Calendar, User, Heart, MessageCircle, Share2, BookOpen } from 'lucide-react'

const blogPosts = [
  {
    id: 1,
    title: '10 Tips for Surviving Your First Semester',
    author: 'Sarah Johnson',
    date: 'Dec 10, 2024',
    category: 'Student Life',
    content: 'Starting college can be overwhelming, but with these tips, you\'ll be ready to tackle your first semester like a pro...',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
    likes: 42,
    comments: 12
  },
  {
    id: 2,
    title: 'Campus Events This Month',
    author: 'Campus Admin',
    date: 'Dec 8, 2024',
    category: 'Events',
    content: 'Don\'t miss out on these exciting events happening around campus this month. From tech fairs to cultural festivals...',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
    likes: 89,
    comments: 24
  },
  {
    id: 3,
    title: 'Study Groups: How to Find Your Perfect Match',
    author: 'Michael Chen',
    date: 'Dec 5, 2024',
    category: 'Academics',
    content: 'Finding the right study group can make all the difference in your academic success. Here\'s how to find your perfect study partners...',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
    likes: 156,
    comments: 38
  },
]

export default function CampusBlog() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const categories = ['All', 'Student Life', 'Events', 'Academics', 'Sports', 'Culture']

  return (
    <div className="max-w-6xl mx-auto">
      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Campus Blog</h1>
            <p className="text-gray-600">Stories, tips, and updates from the campus community</p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Blog Posts */}
      <div className="space-y-6">
        {blogPosts.map((post) => (
          <article key={post.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                    {post.category}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{post.title}</h2>
                <p className="text-gray-600 mb-4">{post.content}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="text-sm">{post.author}</span>
                    </div>
                    <button className="flex items-center gap-2 hover:text-red-600 transition-colors">
                      <Heart className="w-4 h-4" />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-primary-600 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments}</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Share2 className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="btn-primary">Read More</button>
                  </div>
                </div>
              </div>
              <div className="w-64 h-48 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
