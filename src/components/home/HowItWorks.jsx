import { useState, useEffect } from "react";
import { Camera, LayoutTemplate, Palette, Send, Play, ChevronRight, X } from "lucide-react";

/* ---------- DEMO VIDEO ----------
   Option 1 (your own video file): put it at public/videos/demo.mp4 and keep:
       const DEMO_VIDEO = "/videos/demo.mp4";
   Option 2 (YouTube): paste the embed link, for example:
       const DEMO_VIDEO = "https://www.youtube.com/embed/VIDEO_ID";
*/
const DEMO_VIDEO = "https://www.youtube.com/embed/ObSksQzfOmU";
const isYouTube = DEMO_VIDEO.includes("youtube.com") || DEMO_VIDEO.includes("youtu.be");
// true = tall phone video (YouTube Shorts / reels), false = normal wide video
const IS_VERTICAL = true;

const steps = [
  { n: 1, icon: Camera, title: "Take Photo", desc: "Click a selfie or group photo", bg: "bg-pink-50", ring: "bg-pink-500", color: "text-pink-500" },
  { n: 2, icon: LayoutTemplate, title: "Choose Template", desc: "Select your favourite design", bg: "bg-purple-50", ring: "bg-purple-500", color: "text-purple-500" },
  { n: 3, icon: Palette, title: "Customize", desc: "Add name, message or logo", bg: "bg-sky-50", ring: "bg-sky-500", color: "text-sky-500" },
  { n: 4, icon: Send, title: "Save & Share", desc: "Download, share or get print", bg: "bg-emerald-50", ring: "bg-emerald-500", color: "text-emerald-500" },
];

/* ---------- VIDEO POPUP ---------- */
function VideoModal({ onClose }) {
  // Close with Esc key and stop the page scrolling behind the popup
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Demo video"
    >
      <div
        className={`relative w-full ${IS_VERTICAL ? "max-w-[min(360px,calc((100vh-120px)*9/16))]" : "max-w-3xl"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close video"
          className="absolute -top-11 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 shadow hover:text-purple-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className={`${IS_VERTICAL ? "aspect-9/16" : "aspect-video"} overflow-hidden rounded-2xl bg-black shadow-2xl`}>
          {isYouTube ? (
            <iframe
              src={`${DEMO_VIDEO}?autoplay=1&rel=0`}
              title="The Booth Trend demo video"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          ) : (
            <video src={DEMO_VIDEO} controls autoPlay playsInline className="h-full w-full" />
          )}
        </div>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section className="bg-slate-50/60 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">How It Works</h2>
            <p className="mt-1 text-sm text-slate-500">Create beautiful photos in just a few steps</p>
          </div>
          <button
            onClick={() => setShowVideo(true)}
            className="group flex items-center gap-2 rounded-full border border-purple-200 bg-white py-1.5 pl-1.5 pr-4 text-xs font-semibold text-purple-600 shadow-sm hover:border-purple-400"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-r from-fuchsia-500 to-purple-600 text-white transition group-hover:scale-110">
              <Play className="h-3.5 w-3.5 fill-white" />
            </span>
            See Demo Video
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className={`relative flex items-center gap-4 rounded-2xl ${s.bg} p-5 transition hover:-translate-y-1 hover:shadow-md sm:block`}
            >
              {/* Icon tile with number badge */}
              <div className="relative shrink-0 sm:mb-4 sm:inline-block">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <s.icon className={`h-7 w-7 ${s.color}`} strokeWidth={1.8} />
                </div>
                <span
                  className={`absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full ${s.ring} text-[11px] font-bold text-white ring-2 ring-white`}
                >
                  {s.n}
                </span>
              </div>

              <div>
                <p className="font-semibold text-slate-900">{s.title}</p>
                <p className="mt-1 text-sm text-slate-500">{s.desc}</p>
              </div>

              {i < steps.length - 1 && (
                <ChevronRight className="absolute -right-5.5 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-slate-300 lg:block" />
              )}
            </div>
          ))}
        </div>
      </div>

      {showVideo && <VideoModal onClose={() => setShowVideo(false)} />}
    </section>
  );
}