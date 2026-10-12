import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ChevronLeft, ChevronRight, Camera, Store, PartyPopper, User } from "lucide-react";
import hero from "../../assets/hero.jpeg";
import personal from "../../assets/good-vibes.jpeg";
import wedding from "../../assets/forever-together.jpeg";
import funFrame from "../../assets/Fun.png";
import friendsFrame from "../../assets/friends-frame.jpeg";
import festivalFrame from "../../assets/festival-frame.jpeg";

/* ---------- SLIDES ---------- */
const slides = [
  {
    tab: "For Everyone",
    icon: Camera,
    title: "Turn Your Moments into",
    highlight: "Memories!",
    text: "Selfie Frames | Event Photos | QR Booth | Custom Templates | Prints & Sharing",
    button: "Launch Demo",
    note: "More than a photo, it's a memory!",
    bg: "from-violet-100 via-fuchsia-50 to-pink-100",
    cards: ["Good Vibes", "Happy Birthday", "Together Forever"],
    img: "",
  },
  {
    tab: "Personal",
    icon: User,
    title: "Your Selfies, in",
    highlight: "Beautiful Frames",
    text: "Pick a frame, add your name or a message, and share it on WhatsApp or Instagram in seconds.",
    button: "Launch Demo",
    note: "Made by you, loved by all!",
    bg: "from-pink-100 via-rose-50 to-amber-50",
    cards: ["Best Friends", "Family Time", "Good Vibes"],
    img: "",
  },
  {
    tab: "Events",
    icon: PartyPopper,
    title: "Every Guest Leaves with a",
    highlight: "Memory",
    text: "Set up a QR photo booth at your wedding, birthday or festival. Guests scan, click and get instant prints.",
    button: "Launch Demo",
    note: "Scan, smile, celebrate!",
    bg: "from-amber-100 via-orange-50 to-rose-100",
    cards: ["Forever Together", "Happy Diwali", "Party Time"],
    img: "",
  },
  {
    tab: "Business",
    icon: Store,
    title: "Put Your Brand in",
    highlight: "Every Photo",
    text: "A branded QR booth for your store or launch. Customers share photos with your logo, and your brand travels with them.",
    button: "Launch Demo",
    note: "Your brand, in every share!",
    bg: "from-sky-100 via-indigo-50 to-violet-100",
    cards: ["Your Brand Here", "Grand Opening", "Scan & Smile"],
    img: "",
  },
];

// Main picture for each slide (same order as slides above).
// If you fill in a slide's img value, that is used instead.
const slideImages = [funFrame, friendsFrame, festivalFrame, hero];

// Pictures used in the small photo strip behind the main photo
const stripPool = [friendsFrame, festivalFrame, funFrame, hero, wedding, personal];

/* ---------- HERO SLIDER ---------- */
export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const slide = slides[current];
  const image = slide.img || slideImages[current];
  // 3 strip photos, changes with each slide
  const strip = [0, 1, 2].map((i) => stripPool[(current * 2 + i) % stripPool.length]);

  const next = () => setCurrent((c) => (c + 1) % slides.length);
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);

  // Auto-slide every 4 seconds (timer restarts when an arrow or dot is clicked)
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 4000);
    return () => clearTimeout(timer);
  }, [current]);

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-purple-50/70 via-white to-white font-sans">
      <div className="mx-auto max-w-7xl px-4 pt-0 pb-9 sm:px-6 lg:px-8 lg:pb-10">
        {/* Slide content */}
        <div key={current} className="hero-fade grid items-center gap-6 lg:grid-cols-2 lg:gap-10">
          {/* Left: text */}
          <div className="text-center lg:text-left">
            <h1 className="mx-auto mt-3 max-w-xl text-[32px] font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:mx-0 lg:text-[56px]">
              {slide.title}{" "}
              <span className="bg-linear-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                {slide.highlight}
              </span>{" "}
              <Heart className="inline h-7 w-7 fill-fuchsia-500 text-fuchsia-500 sm:h-9 sm:w-9" />
            </h1>

            <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-slate-500 sm:text-base lg:mx-0">
              {slide.text}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              {/* Violet button: opens the photo booth demo */}
              <Link
                to="/demo"
                className="rounded-full bg-linear-to-r from-fuchsia-500 to-purple-600 px-7 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-purple-200 hover:opacity-90"
              >
                {slide.button} →
              </Link>
            </div>
          </div>

          {/* Right: photo booth frames (polaroid + photo strip) */}
          <div className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-none">
            <div className="relative aspect-square w-full">
              {/* Soft colour glow behind the frames (matches each slide) */}
              <div className={`absolute inset-x-[8%] inset-y-[10%] rounded-full bg-linear-to-br ${slide.bg} blur-2xl`} />

              {/* Photo strip (back) */}
              <div className="strip-in absolute right-[1%] top-[10%] w-[29%] rotate-[7deg] bg-white p-[2.5%] pb-0 shadow-xl ring-1 ring-black/5">
                <div className="flex flex-col gap-1.5 sm:gap-2">
                  {strip.map((src, i) => (
                    <div key={i} className="aspect-4/3 overflow-hidden bg-slate-100">
                      <img src={src} alt="" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
                <p className="py-1.5 text-right pr-1 text-[8px] font-semibold tracking-wide text-purple-600 sm:py-2 sm:text-[11px]">
                  The Booth Trend
                </p>
              </div>

              {/* Polaroid (front) */}
              <figure className="polaroid-in absolute left-[1%] top-[12%] w-[68%] -rotate-3 bg-white p-[3%] pb-0 shadow-2xl ring-1 ring-black/5">
                {/* Tape on top */}
                <span className="absolute -top-2.5 left-1/2 h-6 w-20 -translate-x-1/2 rotate-3 bg-fuchsia-200/70 shadow-sm sm:w-28" />
                <div className="aspect-square overflow-hidden bg-slate-100">
                  <img src={image} alt={slide.tab} className="h-full w-full object-cover" />
                </div>
                <figcaption className="flex items-center justify-center gap-1.5 py-3 text-sm font-semibold text-slate-700 sm:py-4 sm:text-lg">
                  {slide.cards[0]}
                  <Heart className="h-3.5 w-3.5 fill-fuchsia-500 text-fuchsia-500 sm:h-4 sm:w-4" />
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>

      {/* Arrows (large screens only, so they never cover content) */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-purple-600 shadow-md xl:flex"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-purple-600 shadow-md xl:flex"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((s, i) => (
          <button
            key={s.tab}
            onClick={() => setCurrent(i)}
            aria-label={`Go to ${s.tab} slide`}
            className={`h-2 rounded-full transition-all ${i === current ? "w-7 bg-purple-600" : "w-2 bg-purple-200"}`}
          />
        ))}
      </div>

      <style>{`
        .hero-fade { animation: heroFade 0.5s ease; }
        @keyframes heroFade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .polaroid-in { animation: polaroidIn 0.6s cubic-bezier(.2,.8,.2,1); }
        .strip-in { animation: stripIn 0.6s 0.1s cubic-bezier(.2,.8,.2,1) both; }
        @keyframes polaroidIn { from { opacity: 0; transform: translateY(18px) scale(.96); } to { opacity: 1; transform: none; } }
        @keyframes stripIn { from { opacity: 0; transform: translateX(-24px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .hero-fade, .polaroid-in, .strip-in { animation: none; } }
      `}</style>
    </section>
  );
}