import { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import birthday from "../../assets/Cele.jpeg";
import wedding from "../../assets/forever-together.jpeg";
import personal from "../../assets/good-vibes.jpeg";
import festival from "../../assets/festival-frame.jpeg";
import friends from "../../assets/friends-frame.jpeg";
import events from "../../assets/events1.jpeg";
import married from "../../assets/married.jpeg";
import engage from "../../assets/Engage.jpeg";
import party from "../../assets/Party.jpeg";
import self from "../../assets/Self.jpeg";
import frame1 from "../../assets/frame1.jpeg";
import frame3 from "../../assets/frame3.jpeg";
import frame4 from "../../assets/frame4.jpeg";
import frame5 from "../../assets/frame5.jpeg";
import frame6 from "../../assets/frame6.jpeg";
import frame7 from "../../assets/frame7.jpeg";
import frame8 from "../../assets/frame8.jpeg";

// Popular picks shown on the home page (full list is on the Gallery page)
const templates = [
  { label: "Birthday", caption: "Happy Birthday", img: birthday },
  { label: "Wedding", caption: "Forever Together", img: wedding },
  { label: "Personal", caption: "Good Vibes", img: personal },
  { label: "Festival", caption: "Happy Diwali", img: festival },
  { label: "Friends", caption: "Best Friends", img: friends },
  { label: "Events", caption: "Event Voice", img: events },
  { label: "Wedding", caption: "Royal Blue Wedding", img: engage },
  { label: "Party", caption: "Time to Disco", img: party },
  { label: "Birthday", caption: "Just Here for the Cake", img: self },
  { label: "Couple", caption: "Engagement Party", img: frame6 },
  { label: "Party", caption: "Bridal Shower", img: frame7 },
  { label: "Graduation", caption: "Congrats Graduate", img: frame8 },
];

export default function Templates() {
  const rowRef = useRef(null);

  // Arrows scroll the row left / right
  const scroll = (dir) => {
    const row = rowRef.current;
    if (row) row.scrollBy({ left: dir * row.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-6">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">Popular Templates</h2>
          <p className="mt-1 text-sm text-slate-500">Beautiful designs for every occasion</p>
        </div>
        <Link
          to="/gallery"
          className="hidden text-sm font-semibold text-purple-600 hover:underline sm:flex sm:items-center sm:gap-1"
        >
          View All Templates <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="relative">
        <button
          onClick={() => scroll(-1)}
          aria-label="Previous"
          className="absolute -left-4 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm hover:text-purple-500 md:flex"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Scrollable row: 2 cards on mobile, 3 on tablet, 6 on desktop */}
        <div
          ref={rowRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {templates.map((t) => (
            <div
              key={t.caption}
              className="w-[calc((100%-1rem)/2)] shrink-0 snap-start text-center sm:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-5rem)/6)]"
            >
              <div
                className={`relative aspect-square overflow-hidden rounded-xl bg-slate-100 shadow-sm ${
                  t.img ? "" : `bg-linear-to-br ${t.grad}`
                }`}
              >
                {t.img && (
                  <>
                    {/* Blurred copy fills the empty sides of tall images */}
                    <img src={t.img} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-xl" />
                    <img src={t.img} alt={t.caption} className="relative h-full w-full object-contain" />
                    <div className="absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-black/60 to-transparent" />
                  </>
                )}
                <span
                  className={`absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-semibold ${
                    t.dark || t.img ? "text-white" : "text-slate-700"
                  }`}
                >
                  {t.caption}
                </span>
              </div>
              <p className="mt-2 text-xs font-medium text-slate-500">{t.label}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll(1)}
          aria-label="Next"
          className="absolute -right-4 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm hover:text-purple-500 md:flex"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
