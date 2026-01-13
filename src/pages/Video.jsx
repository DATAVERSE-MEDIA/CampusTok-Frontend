import { useState } from 'react'
import { Play, ThumbsUp, MessageCircle, Share2, Eye, Clock } from 'lucide-react'

const videos = [
  {
    id: 1,
    title: 'Campus Tour 2024',
    creator: 'Campus Media',
    views: '12.5K',
    likes: 892,
    comments: 134,
    duration: '8:45',
    thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400',
    uploaded: '2 days ago'
  },
  {
    id: 2,
    title: 'Student Life Vlog: A Day in the Life',
    creator: 'Sarah Johnson',
    views: '8.3K',
    likes: 456,
    comments: 67,
    duration: '12:30',
    thumbnail: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400',
    uploaded: '5 days ago'
  },
  {
    id: 3,
    title: 'Study Tips from Top Students',
    creator: 'Academic Success',
    views: '15.2K',
    likes: 1234,
    comments: 189,
    duration: '10:15',
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400',
    uploaded: '1 week ago'
  },
  {
    id: 4,
    title: 'Campus Events Highlights',
    creator: 'Event Team',
    views: '6.7K',
    likes: 321,
    comments: 45,
    duration: '6:20',
    thumbnail: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400',
    uploaded: '3 days ago'
  },
]

export default function Video() {
  const [selectedVideo, setSelectedVideo] = useState(null)

  return (
    <div className="max-w-7xl mx-auto">
      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <Play className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Campus Videos</h1>
            <p className="text-gray-600">Watch videos from the campus community</p>
          </div>
        </div>
      </div>

      {selectedVideo ? (
        <div className="card mb-6">
          <button
            onClick={() => setSelectedVideo(null)}
            className="mb-4 text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Back to Videos
          </button>
          <div className="aspect-video bg-gray-900 rounded-lg mb-4 flex items-center justify-center">
            <div className="text-center text-white">
              <Play className="w-16 h-16 mx-auto mb-4" />
              <p className="text-lg">Video Player</p>
              <p className="text-sm text-gray-400">{selectedVideo.title}</p>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedVideo.title}</h2>
          <div className="flex items-center gap-4 text-gray-600 mb-4">
            <span>{selectedVideo.creator}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {selectedVideo.views} views
            </span>
            <span>•</span>
            <span>{selectedVideo.uploaded}</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              <ThumbsUp className="w-5 h-5" />
              <span>{selectedVideo.likes}</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span>{selectedVideo.comments}</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Share2 className="w-5 h-5" />
              Share
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="card hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedVideo(video)}
            >
              <div className="relative mb-4">
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {video.duration}
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 transition-all group">
                  <Play className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{video.creator}</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {video.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    {video.likes}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
