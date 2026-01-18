// import { useState } from 'react'
// import { Play, ThumbsUp, MessageCircle, Share2, Eye, Clock } from 'lucide-react'

// const videos = [
//   {
//     id: 1,
//     title: 'Campus Tour 2024',
//     creator: 'Campus Media',
//     views: '12.5K',
//     likes: 892,
//     comments: 134,
//     duration: '8:45',
//     thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400',
//     uploaded: '2 days ago'
//   },
//   {
//     id: 2,
//     title: 'Student Life Vlog: A Day in the Life',
//     creator: 'Sarah Johnson',
//     views: '8.3K',
//     likes: 456,
//     comments: 67,
//     duration: '12:30',
//     thumbnail: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400',
//     uploaded: '5 days ago'
//   },
//   {
//     id: 3,
//     title: 'Study Tips from Top Students',
//     creator: 'Academic Success',
//     views: '15.2K',
//     likes: 1234,
//     comments: 189,
//     duration: '10:15',
//     thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400',
//     uploaded: '1 week ago'
//   },
//   {
//     id: 4,
//     title: 'Campus Events Highlights',
//     creator: 'Event Team',
//     views: '6.7K',
//     likes: 321,
//     comments: 45,
//     duration: '6:20',
//     thumbnail: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400',
//     uploaded: '3 days ago'
//   },
// ]

// export default function Video() {
//   const [selectedVideo, setSelectedVideo] = useState(null)

//   return (
//     <div className="max-w-7xl mx-auto">
//       <div className="card mb-6">
//         <div className="flex items-center gap-3 mb-2">
//           <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
//             <Play className="w-6 h-6 text-primary" />
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Campus Videos</h1>
//             <p className="text-gray-600">Watch videos from the campus community</p>
//           </div>
//         </div>
//       </div>

//       {selectedVideo ? (
//         <div className="card mb-6">
//           <button
//             onClick={() => setSelectedVideo(null)}
//             className="mb-4 text-primary-600 hover:text-primary-700 font-medium"
//           >
//             ← Back to Videos
//           </button>
//           <div className="aspect-video bg-gray-900 rounded-lg mb-4 flex items-center justify-center">
//             <div className="text-center text-white">
//               <Play className="w-16 h-16 mx-auto mb-4" />
//               <p className="text-lg">Video Player</p>
//               <p className="text-sm text-gray-400">{selectedVideo.title}</p>
//             </div>
//           </div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedVideo.title}</h2>
//           <div className="flex items-center gap-4 text-gray-600 mb-4">
//             <span>{selectedVideo.creator}</span>
//             <span>•</span>
//             <span className="flex items-center gap-1">
//               <Eye className="w-4 h-4" />
//               {selectedVideo.views} views
//             </span>
//             <span>•</span>
//             <span>{selectedVideo.uploaded}</span>
//           </div>
//           <div className="flex items-center gap-4">
//             <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
//               <ThumbsUp className="w-5 h-5" />
//               <span>{selectedVideo.likes}</span>
//             </button>
//             <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
//               <MessageCircle className="w-5 h-5" />
//               <span>{selectedVideo.comments}</span>
//             </button>
//             <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
//               <Share2 className="w-5 h-5" />
//               Share
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {videos.map((video) => (
//             <div
//               key={video.id}
//               className="card hover:shadow-lg transition-shadow cursor-pointer"
//               onClick={() => setSelectedVideo(video)}
//             >
//               <div className="relative mb-4">
//                 <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
//                   <img
//                     src={video.thumbnail}
//                     alt={video.title}
//                     className="w-full h-full object-cover"
//                     onError={(e) => {
//                       e.target.style.display = 'none'
//                     }}
//                   />
//                 </div>
//                 <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
//                   <Clock className="w-4 h-4" />
//                   {video.duration}
//                 </div>
//                 <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 transition-all group">
//                   <Play className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
//                 </div>
//               </div>
//               <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
//               <div className="flex items-center justify-between text-sm text-gray-600">
//                 <span>{video.creator}</span>
//                 <div className="flex items-center gap-3">
//                   <span className="flex items-center gap-1">
//                     <Eye className="w-4 h-4" />
//                     {video.views}
//                   </span>
//                   <span className="flex items-center gap-1">
//                     <ThumbsUp className="w-4 h-4" />
//                     {video.likes}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

import { useState, useRef } from "react";
import {
  Play,
  Pause,
  ThumbsUp,
  MessageCircle,
  Share2,
  Eye,
  ArrowUp,
  ArrowDown,
  Volume2,
  VolumeX,
} from "lucide-react";

const videos = [
  {
    id: 1,
    title: "Student Life Vlog",
    creator: "Olawale Francis",
    views: "8.3K",
    likes: 120,
    comments: 24,
    shares: 50,
    uploaded: "5 days ago",
    src: "/vids/vid1.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    title: "Campus Experience",
    creator: "Sarah Johnson",
    views: "12.1K",
    likes: 456,
    comments: 67,
    shares: 89,
    uploaded: "2 days ago",
    src: "/vids/vid2.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function Video() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef(null);
  const video = videos[activeIndex];

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoChange = (newIndex) => {
    setActiveIndex(newIndex);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Card */}
      <div className="relative h-[88vh] rounded-3xl overflow-hidden bg-black shadow">
        {/* Video */}
        <video
          ref={videoRef}
          src={video.src}
          poster={video.thumbnail}
          className="absolute inset-0 w-full h-full object-cover"
          loop
          playsInline
          muted={isMuted}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Center play/pause overlay */}
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center"
        >
          {!isPlaying && (
            <div className="w-20 h-20 rounded-full bg-white/30 backdrop-blur flex items-center justify-center">
              <Play className="w-10 h-10 text-white ml-1" />
            </div>
          )}
        </button>

        {/* Mute button (bottom left) */}
        <button
          onClick={toggleMute}
          className="absolute bottom-28 left-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center z-10"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-white" />
          ) : (
            <Volume2 className="w-5 h-5 text-white" />
          )}
        </button>

        {/* Navigation arrows (top right) */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button
            onClick={() =>
              handleVideoChange(
                activeIndex === 0 ? videos.length - 1 : activeIndex - 1,
              )
            }
            className="w-10 h-10 rounded-xl bg-white shadow flex items-center justify-center"
          >
            <ArrowUp className="w-5 h-5 text-gray-700" />
          </button>

          <button
            onClick={() =>
              handleVideoChange(
                activeIndex === videos.length - 1 ? 0 : activeIndex + 1,
              )
            }
            className="w-10 h-10 rounded-xl bg-white shadow flex items-center justify-center"
          >
            <ArrowDown className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Right-side actions */}
        <div className="absolute right-4 bottom-28 flex flex-col items-center gap-6 z-10">
          {[
            { icon: ThumbsUp, value: video.likes },
            { icon: MessageCircle, value: video.comments },
            { icon: Share2, value: video.shares },
          ].map(({ icon: Icon, value }, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur shadow flex items-center justify-center">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-white font-medium">{value}</span>
            </div>
          ))}
        </div>

        {/* Bottom creator card */}
        <div className="absolute bottom-4 left-4 right-20 z-10">
          <div className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold">
                {video.creator.charAt(0)}
              </div>
              <p className="font-semibold text-gray-900">{video.creator}</p>
            </div>

            <p className="font-medium text-gray-900">{video.title}</p>

            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <Eye className="w-4 h-4" />
              <span>{video.views}</span>
              <span>• {video.uploaded}</span>
            </div>

            <button className="mt-3 px-4 py-1.5 rounded-full border border-gray-900 text-sm font-medium hover:bg-gray-900 hover:text-white transition">
              Follow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
