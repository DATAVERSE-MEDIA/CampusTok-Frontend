import { useEffect, useMemo, useRef, useState } from "react";
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

// scroll / swipe settings
const WHEEL_COOLDOWN_MS = 600;
const TOUCH_THRESHOLD_PX = 60;

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
  const [error, setError] = useState(null);

  // ✅ computed horizontal offset so the reel aligns to "Campus Blog" END
  const [offsetX, setOffsetX] = useState(0);

  const institutionId = getInstitutionId(selectedSchool);

  const cardRef = useRef(null);
  const pageRef = useRef(null);

  // wheel/touch state
  const wheelLockRef = useRef(false);
  const touchStartYRef = useRef(null);

  const goPrev = () =>
    setActiveIndex((i) => (i === 0 ? reels.length - 1 : i - 1));
  const goNext = () =>
    setActiveIndex((i) => (i === reels.length - 1 ? 0 : i + 1));

  useEffect(() => {
    let cancelled = false;

    async function fetchReels() {
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
          setError(e?.message || "Failed to load reels");
          setReels([]);
        }
      }
    }

    fetchReels();
    return () => {
      cancelled = true;
    };
  }, [institutionId]);

  const video = useMemo(() => reels[activeIndex], [reels, activeIndex]);

  /**
   * ✅ PERFECT ALIGNMENT on desktop:
   * Align the HORIZONTAL CENTER of the reel card
   * with the HORIZONTAL CENTER of the top nav tabs
   * (so the nav pill visually sits above the reels frame).
   */
  useEffect(() => {
    function compute() {
      // only on lg+ (desktop)
      if (window.innerWidth < 1024) {
        setOffsetX(0);
        return;
      }

      const cardEl = cardRef.current;
      if (!cardEl) return;

      // Get the nav tabs container (desktop only)
      const tabsContainer = document.getElementById("nav-tabs-container");
      if (!tabsContainer) {
        setOffsetX(0);
        return;
      }

      const navRect = tabsContainer.getBoundingClientRect();
      const navCenterX = (navRect.left + navRect.right) / 2;

      const cardRect = cardEl.getBoundingClientRect();
      const cardCenterX = (cardRect.left + cardRect.right) / 2;

      // Calculate the exact offset needed to align centers
      const offsetNeeded = navCenterX - cardCenterX;

      setOffsetX(offsetNeeded);
    }

    // Compute alignment after a small delay to ensure all elements are rendered
    const initialTimer = setTimeout(compute, 100);

    // Recompute on resize & layout shifts
    const onResize = () => compute();
    window.addEventListener("resize", onResize);

    // watch for sidebar width changes / DOM shifts
    const ro = new ResizeObserver(() => compute());
    ro.observe(document.body);

    // Recompute when fonts load
    document.fonts.ready.then(() => compute());

    // Additional safety recompute after a longer delay
    const safetyTimer = setTimeout(compute, 500);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(safetyTimer);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, []);

  /**
   * ✅ TikTok-style scroll snapping:
   * - mouse wheel up/down changes active reel with cooldown
   * - touch swipe up/down changes active reel
   */
  useEffect(() => {
    function onWheel(e) {
      if (window.innerWidth < 1024) return; // keep wheel normal on mobile if you want
      if (wheelLockRef.current) return;

      const dy = e.deltaY;
      if (Math.abs(dy) < 20) return;

      wheelLockRef.current = true;
      if (dy > 0) goNext();
      else goPrev();

      setTimeout(() => {
        wheelLockRef.current = false;
      }, WHEEL_COOLDOWN_MS);
    }

    const el = pageRef.current;
    if (!el) return;

    el.addEventListener("wheel", onWheel, { passive: true });
    return () => el.removeEventListener("wheel", onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reels.length]);

  function onTouchStart(e) {
    touchStartYRef.current = e.touches?.[0]?.clientY ?? null;
  }

  function onTouchEnd(e) {
    const startY = touchStartYRef.current;
    if (startY == null) return;

    const endY = e.changedTouches?.[0]?.clientY ?? startY;
    const diff = startY - endY;

    if (Math.abs(diff) >= TOUCH_THRESHOLD_PX) {
      if (diff > 0) goNext(); // swipe up
      else goPrev(); // swipe down
    }

    touchStartYRef.current = null;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-2">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!reels.length) {
    return null;
  }

  return (
    <div ref={pageRef} className="w-full">
      <div className="flex justify-center items-center px-3 sm:px-4 lg:px-8 py-4 lg:py-6">
        <div
          className="w-full max-w-md"
          style={{
            // transform: `translateX(${offsetX}px)`,
            transition: "transform 320ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {/* ✅ Reel card with responsive height and perfect aspect ratio */}
          <div
            ref={cardRef}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className="relative w-full aspect-[9/16] rounded-3xl overflow-hidden bg-white shadow-lg"
          >
            {/* Video or placeholder */}
            {video?.videoUrl ? (
              <video
                key={video.id}
                src={video.videoUrl}
                className="absolute inset-0 w-full h-full object-cover animate-[fadeIn_280ms_ease-out]"
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
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex gap-2 z-10">
              <button
                onClick={goPrev}
                className="w-10 h-10 rounded-xl bg-white shadow flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <ArrowUp className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={goNext}
                className="w-10 h-10 rounded-xl bg-white shadow flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <ArrowDown className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Right-side actions */}
            <div className="absolute right-2 sm:right-4 bottom-24 sm:bottom-28 flex flex-col items-center gap-4 sm:gap-6 z-10">
              {[
                { icon: ThumbsUp, value: video.likes },
                { icon: MessageCircle, value: video.comments },
                { icon: Share2, value: video.shares },
              ].map(({ icon: Icon, value }, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 shadow flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                  </div>
                  <span className="text-xs sm:text-sm text-gray-700 font-medium">{value}</span>
                </div>
              ))}
            </div>

            {/* Bottom creator card */}
            <div className="absolute bottom-2 left-2 right-14 sm:bottom-4 sm:left-4 sm:right-20 z-10">
              <div className="bg-transparent rounded-2xl p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3 mb-1">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/30 border border-white/50 flex-shrink-0" />
                  <p className="font-semibold text-white drop-shadow-md text-sm sm:text-base">
                    {video.creator}
                  </p>
                </div>

                <p className="font-medium text-white drop-shadow-md line-clamp-2 text-sm sm:text-base">
                  {video.title}
                </p>

                <div className="flex items-center gap-2 text-xs sm:text-sm text-white/90 drop-shadow-md mt-1">
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span>{video.views}</span>
                  {video.uploaded && <span>• {video.uploaded}</span>}
                </div>

                <button className="mt-2 sm:mt-3 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-white text-white text-xs sm:text-sm font-medium hover:bg-white hover:text-gray-900 transition-colors">
                  Follow
                </button>
              </div>
            </div>

            {/* Keyframes */}
            <style>{`
              @keyframes fadeIn {
                from { opacity: 0; transform: scale(1.01); }
                to { opacity: 1; transform: scale(1); }
              }
            `}</style>
          </div>
        </div>
      </div>
    </div>
  );
}
