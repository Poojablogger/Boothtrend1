import { useEffect, useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import Navbar from "../home/Navbar";
import Footer from "../home/Footer";
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

const categories = ["All", "Birthday", "Wedding", "Personal", "Festival", "Friends", "Events", "Couple", "Party", "Graduation"];

// Every template has its own image (no repeats)
const templates = [
  { id: 1, title: "Happy Birthday", category: "Birthday", img: birthday },
  { id: 2, title: "Forever Together", category: "Wedding", img: wedding },
  { id: 3, title: "Good Vibes", category: "Personal", img: personal },
  { id: 4, title: "Happy Diwali", category: "Festival", img: festival },
  { id: 5, title: "Best Friends", category: "Friends", img: friends },
  { id: 6, title: "Event Voice", category: "Events", img: events },
  { id: 7, title: "Golden Garden Frame", category: "Wedding", img: married },
  { id: 8, title: "Floral Name Frame", category: "Wedding", img: frame3 },
  { id: 9, title: "Royal Blue Wedding", category: "Wedding", img: engage },
  { id: 10, title: "Happy Valentine's Day", category: "Party", img: frame1 },
  { id: 11, title: "Time to Disco", category: "Party", img: party },
  { id: 12, title: "Bridal Shower", category: "Party", img: frame7 },
  { id: 13, title: "Just Here for the Cake", category: "Birthday", img: self },
  { id: 14, title: "Polaroid Couple Frame", category: "Couple", img: frame4 },
  { id: 15, title: "Love Balloon Stand", category: "Couple", img: frame5 },
  { id: 16, title: "Engagement Party", category: "Couple", img: frame6 },
  { id: 17, title: "Congrats Graduate", category: "Graduation", img: frame8 },
];

export default function Gallery() {
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");

  // Open the page from the top (not from where Home was scrolled)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filtered = templates.filter((t) => {
    const matchCategory = active === "All" || t.category === active;
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <Navbar />

      {/* Header */}
      <section className="bg-linear-to-b from-purple-50/60 via-white to-white">
        <div className="mx-auto max-w-7xl px-6 pt-10 pb-6 text-center">
          <p className="text-xs font-semibold tracking-wide text-purple-500">TEMPLATE GALLERY</p>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Find the Perfect{" "}
            <span className="bg-linear-to-r from-fuchsia-500 to-purple-600 bg-clip-text text-transparent">
              Frame
            </span>
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Beautiful designs for birthdays, weddings, festivals, events and more
          </p>

          {/* Search */}
          <div className="mx-auto mt-6 flex max-w-md items-center gap-2 rounded-full border border-purple-200 bg-white px-4 py-2.5 shadow-sm">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates..."
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>

          {/* Category filters */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active === cat
                    ? "bg-linear-to-r from-fuchsia-500 to-purple-600 text-white shadow-md shadow-purple-200"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-purple-300 hover:text-purple-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <p className="mb-4 text-sm text-slate-500">
          Showing <span className="font-semibold text-slate-800">{filtered.length}</span> templates
        </p>

        {filtered.length === 0 ? (
          <p className="py-20 text-center text-slate-400">No templates found. Try another search.</p>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((t) => (
              <div
                key={t.id}
                className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-square overflow-hidden bg-slate-100">
                  {/* Blurred copy fills the empty sides of tall images */}
                  <img src={t.img} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-xl" />
                  {/* Full image, never cropped */}
                  <img
                    src={t.img}
                    alt={t.title}
                    className="relative h-full w-full object-contain transition duration-300 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-purple-600">
                    {t.category}
                  </span>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-end justify-center bg-linear-to-t from-black/60 to-transparent p-4 opacity-0 transition group-hover:opacity-100">
                    <button className="flex items-center gap-1 rounded-full bg-white px-4 py-2 text-xs font-semibold text-purple-600">
                      Use Template <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-slate-800">{t.title}</p>
                  <p className="text-xs text-slate-400">{t.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
