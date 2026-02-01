import { useState, useEffect } from "react";
import {
  Play,
  ThumbsUp,
  MessageCircle,
  Share2,
  Eye,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { apiClient } from "../api";

const INSTITUTION_IDS = ["unilag", "yabatech", "ileife"];

function getInstitutionId(selectedSchool) {
  if (selectedSchool?.id && INSTITUTION_IDS.includes(selectedSchool.id)) {
    return selectedSchool.id;
  }
  return "unilag";
}

function mapReelFromApi(post) {
  const videoMedia = post.media?.find((m) => m.media_type === "video");
  const videoUrl = videoMedia?.url || null;
  const title =
    typeof post.content === "string"
      ? post.content.split("\n")[0].slice(0, 80) || "Reel"
      : "Reel";
  return {
    id: post.id,
    title,
    creator: post.author?.full_name || "Unknown",
    views: "—",
    likes: 0,
    comments: 0,
    shares: 0,
    uploaded: "",
    thumbnail: null,
    videoUrl,
    content: post.content,
  };
}

export default function Video() {
  const { selectedSchool } = useAppStore();
  const [reels, setReels] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const institutionId = getInstitutionId(selectedSchool);

  useEffect(() => {
    let cancelled = false;

    async function fetchReels() {
      setIsLoading(true);
      setError(null);
      try {
        const params = { post_type: "reel", skip: 0, limit: 100 };
        const response = await apiClient.get(
          `/posts/institution/${institutionId}`,
          { params }
        );
        const raw = response.data?.data ?? response.data ?? [];
        const list = Array.isArray(raw) ? raw : [];
        const reelsOnly = list.filter((p) => p.post_type === "reel");
        const mapped = reelsOnly.map(mapReelFromApi).filter((r) => r.videoUrl);
        if (!cancelled) {
          setReels(mapped);
          setActiveIndex(0);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.message || "Failed to load reels");
          setReels([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchReels();
    return () => {
      cancelled = true;
    };
  }, [institutionId]);

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-500">Loading reels...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[60vh] gap-2">
        <p className="text-red-600">{error}</p>
        <p className="text-sm text-gray-500">
          Reels for {selectedSchool?.name || institutionId}
        </p>
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[60vh] gap-2">
        <p className="text-gray-600">No reels yet</p>
        <p className="text-sm text-gray-500">
          for {selectedSchool?.name || institutionId}
        </p>
      </div>
    );
  }

  const video = reels[activeIndex];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Mobile: centered. Desktop: pushed right to align under "Campus Blog" text */}
      <div className="flex justify-center lg:flex lg:justify-end">
        {/* 
          Desktop alignment tweak:
          - We push the card slightly to the RIGHT so its right edge lines up
            under the "Campus Blog" text in your TopNav.
          - If you need micro-adjustment: change 112px to 96px or 128px.
        */}
        <div className="max-w-md w-full mx-auto lg:mx-0 lg:translate-x-[-740px]">
          <div className="relative h-[88vh] rounded-3xl overflow-hidden bg-white shadow">
            {/* Video or thumbnail */}
            {video.videoUrl ? (
              <video
                key={video.id}
                src={video.videoUrl}
                className="absolute inset-0 w-full h-full object-cover"
                controls
                playsInline
                loop
                muted
                autoPlay
              />
            ) : (
              <div className="absolute inset-0 w-full h-full bg-gray-900 flex items-center justify-center">
                <Play className="w-20 h-20 text-white opacity-80" />
              </div>
            )}

            {/* Navigation arrows */}
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <button
                onClick={() =>
                  setActiveIndex((i) => (i === 0 ? reels.length - 1 : i - 1))
                }
                className="w-10 h-10 rounded-xl bg-white shadow flex items-center justify-center"
              >
                <ArrowUp className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={() =>
                  setActiveIndex((i) => (i === reels.length - 1 ? 0 : i + 1))
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

            {/* Bottom creator card - transparent */}
            <div className="absolute bottom-4 left-4 right-20 z-10">
              <div className="bg-transparent rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-9 h-9 rounded-full bg-white/30 border border-white/50" />
                  <p className="font-semibold text-white drop-shadow-md">
                    {video.creator}
                  </p>
                </div>
                <p className="font-medium text-white drop-shadow-md line-clamp-2">
                  {video.title}
                </p>
                <div className="flex items-center gap-2 text-sm text-white/90 drop-shadow-md mt-1">
                  <Eye className="w-4 h-4" />
                  <span>{video.views}</span>
                  {video.uploaded && <span>• {video.uploaded}</span>}
                </div>
                <button className="mt-3 px-4 py-1.5 rounded-full border border-white text-white text-sm font-medium hover:bg-white hover:text-gray-900 transition">
                  Follow
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
