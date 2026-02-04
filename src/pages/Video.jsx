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

// ✅ tweak this ONLY if you want micro adjustment after it aligns
const MANUAL_NUDGE_PX = 10;

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
  const [isLoading, setIsLoading] = useState(true);
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
          setError(e?.message || "Failed to load reels");
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

  const video = useMemo(() => reels[activeIndex], [reels, activeIndex]);

  /**
   * ✅ LOCK ALIGNMENT even when sidebar width changes:
   * We measure the Campus Blog button and align the REEL CARD RIGHT EDGE
   * to the Campus Blog button RIGHT EDGE.
   *
   * We query the nav item by its href -> "/blog"
   */
  useEffect(() => {
    function compute() {
      // only on lg+ (desktop)
      if (window.innerWidth < 1024) {
        setOffsetX(0);
        return;
      }

      const cardEl = cardRef.current;
      const pageEl = pageRef.current;
      if (!cardEl || !pageEl) return;

      // find the Campus Blog button in your TopNav
      // your TopNav uses <button> with onClick, not <a>
      // so we detect it by text content "Campus Blog"
      const navButton = Array.from(document.querySelectorAll("button")).find(
        (b) => (b.textContent || "").trim().includes("Campus Blog")
      );

      if (!navButton) {
        setOffsetX(0);
        return;
      }

      const navRect = navButton.getBoundingClientRect();
      const cardRect = cardEl.getBoundingClientRect();
      const pageRect = pageEl.getBoundingClientRect();

      // ✅ align END of Campus Blog to END of card
      const navRightX = navRect.right;
      const cardRightX = cardRect.right;

      const delta = navRightX - cardRightX + MANUAL_NUDGE_PX;

      // clamp so it never flies out of view
      const maxShiftLeft = pageRect.left - cardRect.left - 24;
      const maxShiftRight = pageRect.right - cardRect.right + 24;
      const clamped = Math.max(maxShiftLeft, Math.min(delta, maxShiftRight));

      setOffsetX(clamped);
    }

    compute();

    // Recompute on resize & layout shifts
    const onResize = () => compute();
    window.addEventListener("resize", onResize);

    // watch for sidebar width changes / DOM shifts
    const ro = new ResizeObserver(() => compute());
    ro.observe(document.body);

    // in case fonts load later etc
    const t = setTimeout(compute, 250);

    return () => {
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      clearTimeout(t);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-500">Loading reels...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-2">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!reels.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-2">
        <p className="text-gray-600">No reels yet</p>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="px-4 sm:px-6 lg:px-8">
      {/* ✅ Responsive layout: always centered baseline; desktop auto-shifts to match Campus Blog */}
      <div className="flex justify-center">
        <div
          className="w-full max-w-md"
          style={{
            transform: `translateX(${offsetX}px)`,
            transition: "transform 320ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {/* ✅ Reel card with fade animation between reels */}
          <div
            ref={cardRef}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className="relative h-[88vh] rounded-3xl overflow-hidden bg-white shadow"
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
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <button
                onClick={goPrev}
                className="w-10 h-10 rounded-xl bg-white shadow flex items-center justify-center"
              >
                <ArrowUp className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={goNext}
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
