import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ChevronLeft, ChevronRight, Camera, Store, PartyPopper, User } from "lucide-react";
import hero from "../../assets/hero.jpeg";
import personal from "../../assets/personal.jpeg";
import wedding from "../../assets/wedding.jpeg";
import events from "../../assets/events.jpeg";

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
const slideImages = [hero, personal, wedding, events];

/* ---------- HERO SLIDER ---------- */
export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const slide = slides[current];
  const image = slide.img || slideImages[current];

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

          {/* Right: image */}
          <div className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-none">
            <div className="overflow-hidden rounded-3xl bg-linear-to-br from-purple-200 via-fuchsia-100 to-orange-100 p-3 shadow-xl sm:p-5 lg:rounded-4xl">
              <div className="aspect-4/3 overflow-hidden rounded-2xl">
                <img src={image} alt={slide.tab} className="h-full w-full object-cover" />
              </div>
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
        @media (prefers-reduced-motion: reduce) { .hero-fade { animation: none; } }
      `}</style>
    </section>
  );
}