import { useState } from "react";
import {
  Play,
  ThumbsUp,
  MessageCircle,
  Share2,
  Eye,
  ArrowUp,
  ArrowDown,
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
    thumbnail:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function Video() {
  const [activeIndex, setActiveIndex] = useState(0);
  const video = videos[activeIndex];

  return (
    <div className="max-w-md mx-auto">
      {/* Card */}
      <div className="relative h-[88vh] rounded-3xl overflow-hidden bg-white shadow">
        {/* Image */}
        <img
          src={video.thumbnail}
          alt={video.title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1520975922284-8b456906c813?auto=format&fit=crop&w=1200&q=80";
          }}
        />

        {/* Center play icon */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Play className="w-20 h-20 text-white opacity-80" />
        </div>

        {/* Navigation arrows (top right) */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button
            onClick={() =>
              setActiveIndex((i) => (i === 0 ? videos.length - 1 : i - 1))
            }
            className="w-10 h-10 rounded-xl bg-white shadow flex items-center justify-center"
          >
            <ArrowUp className="w-5 h-5 text-gray-700" />
          </button>

          <button
            onClick={() =>
              setActiveIndex((i) => (i === videos.length - 1 ? 0 : i + 1))
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
              <div className="w-12 h-12 rounded-full bg-gray-100 shadow flex items-center justify-center">
                <Icon className="w-6 h-6 text-gray-700" />
              </div>
              <span className="text-sm text-gray-700">{value}</span>
            </div>
          ))}
        </div>

        {/* Bottom creator card */}
        <div className="absolute bottom-4 left-4 right-20 z-10">
          <div className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-full bg-gray-300" />
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
