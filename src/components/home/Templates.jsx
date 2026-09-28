import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import birthday from "../../assets/birthday.jpeg";
import wedding from "../../assets/wedding.jpeg";
import personal from "../../assets/personal.jpeg";
import festival from "../../assets/festival.jpeg";
import friends from "../../assets/friends.jpeg";
import events from "../../assets/events.jpeg";

const templates = [
  { label: "Birthday", caption: "Happy Birthday", grad: "from-sky-200 to-pink-200", img: birthday },
  { label: "Wedding", caption: "Forever Together", grad: "from-amber-100 to-rose-100", img: wedding },
  { label: "Personal", caption: "Good Vibes", grad: "from-pink-100 to-orange-100", img: personal },
  { label: "Festival", caption: "Happy Diwali", grad: "from-orange-500 to-amber-600", dark: true, img: festival },
  { label: "Friends", caption: "Best Friends", grad: "from-indigo-200 to-purple-200", img: friends },
  { label: "Events", caption: "Event Vibes", grad: "from-slate-900 to-fuchsia-900", dark: true, img: events },
];

export default function Templates() {
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
          aria-label="Previous"
          className="absolute -left-4 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm hover:text-purple-500 md:flex"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {templates.map((t) => (
            <div key={t.label} className="text-center">
              <div
                className={`relative aspect-square overflow-hidden rounded-xl shadow-sm ${
                  t.img ? "" : `bg-linear-to-br ${t.grad}`
                }`}
              >
                {t.img && (
                  <>
                    <img src={t.img} alt={t.caption} className="h-full w-full object-cover" />
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
          aria-label="Next"
          className="absolute -right-4 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm hover:text-purple-500 md:flex"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
