import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import user1 from "../../assets/user1.jpeg";
import user2 from "../../assets/user2.jpeg";
import user3 from "../../assets/user3.jpeg";

// Replace avatars with real customer photos when you have them
const testimonials = [
  {
    name: "Priya S.",
    role: "Birthday Party, Coimbatore",
    avatar: user1,
    quote: "Amazing templates and so easy to use! Our event photos looked fantastic and every guest took a printed copy home.",
  },
  {
    name: "Arun K.",
    role: "Store Owner, Tiruppur",
    avatar: user2,
    quote: "The QR booth at our store increased customer engagement. People shared photos with our logo all week. Great support!",
  },
  {
    name: "Meena R.",
    role: "Wedding, Madurai",
    avatar: user3,
    quote: "Beautiful designs for every occasion. The team set everything up on time and our guests loved the instant prints.",
  },
  {
    name: "Divya M.",
    role: "Engagement, Chennai",
    avatar: user1,
    quote: "We picked a floral frame and added our names. The photos looked like they were made by a professional studio.",
  },
  {
    name: "Karthik R.",
    role: "Product Launch, Erode",
    avatar: user2,
    quote: "Setup was quick, the branded frames looked sharp, and we got hundreds of shares on Instagram the same day.",
  },
  {
    name: "Lakshmi P.",
    role: "Diwali Celebration, Salem",
    avatar: user3,
    quote: "The festival templates were so pretty. Our whole family made photos and shared them on WhatsApp in seconds.",
  },
  {
    name: "Vignesh T.",
    role: "College Fest, Trichy",
    avatar: user2,
    quote: "Students queued up at the booth all day. Scanning the QR and getting a print was simple for everyone.",
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const last = testimonials.length - 1;
  const t = testimonials[index];

  const next = () => setIndex((i) => (i === last ? 0 : i + 1));
  const prev = () => setIndex((i) => (i === 0 ? last : i - 1));

  // Next review every 4 seconds (restarts after an arrow or dot click)
  useEffect(() => {
    const timer = setTimeout(next, 4000);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
      {/* Heading */}
      <div className="mb-6 text-center">
        <p className="text-xs font-semibold tracking-[0.18em] text-purple-500">TESTIMONIALS</p>
        <h2 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">What Our Users Say</h2>
      </div>

      {/* Card with arrows on both sides */}
      <div className="relative mx-auto max-w-3xl">
        <button
          onClick={prev}
          aria-label="Previous review"
          className="absolute -left-14 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:border-purple-300 hover:text-purple-600 md:flex"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div
          key={index}
          className="review-fade relative rounded-2xl border border-slate-100 bg-white px-5 py-6 text-center shadow-md sm:px-10"
        >
          <Quote className="absolute right-5 top-5 h-7 w-7 text-purple-100" fill="currentColor" />

          {/* Photo, name and stars in one line */}
          <div className="flex items-center justify-center gap-3">
            <img
              src={t.avatar}
              alt={t.name}
              className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-purple-100"
            />
            <div className="text-left">
              <div className="flex flex-wrap items-center gap-x-2">
                <p className="font-semibold text-slate-900">{t.name}</p>
                <div className="flex gap-0.5 text-amber-400">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} className="h-3.5 w-3.5" fill="currentColor" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-400">{t.role}</p>
            </div>
          </div>

          {/* Comment */}
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">“{t.quote}”</p>
        </div>

        <button
          onClick={next}
          aria-label="Next review"
          className="absolute -right-14 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:border-purple-300 hover:text-purple-600 md:flex"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Dots (with arrows beside them on phones) */}
      <div className="mt-4 flex items-center justify-center gap-3">
        <button onClick={prev} aria-label="Previous review" className="text-slate-400 hover:text-purple-600 md:hidden">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex gap-2">
          {testimonials.map((r, i) => (
            <button
              key={r.name}
              onClick={() => setIndex(i)}
              aria-label={`Show review from ${r.name}`}
              className={`h-2 rounded-full transition-all ${i === index ? "w-7 bg-purple-600" : "w-2 bg-purple-200"}`}
            />
          ))}
        </div>
        <button onClick={next} aria-label="Next review" className="text-slate-400 hover:text-purple-600 md:hidden">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <style>{`
        .review-fade { animation: reviewFade 0.5s ease; }
        @keyframes reviewFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .review-fade { animation: none; } }
      `}</style>
    </section>
  );
}
