import { Link } from "react-router-dom";
import { CircleCheck, QrCode, Phone, ArrowRight, Palette, Share2, TrendingUp } from "lucide-react";

const points = ["Perfect for Events", "Boost Brand Visibility", "Easy Setup", "Full Support"];

const perks = [
  { icon: Palette, label: "Custom branding" },
  { icon: Share2, label: "Instant sharing" },
  { icon: TrendingUp, label: "More engagement" },
];

export default function BusinessBanner() {
  return (
    <section id="business" className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
      <div className="relative grid items-center gap-8 overflow-hidden rounded-3xl bg-linear-to-br from-purple-100 via-fuchsia-50 to-sky-100 p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr] lg:p-12">
        {/* Soft background circles */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-sky-200/40 blur-3xl" />

        {/* Left: text */}
        <div className="relative">
          <span className="inline-block rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold tracking-[0.15em] text-purple-600 shadow-sm">
            FOR BUSINESSES
          </span>

          <h3 className="mt-4 text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Bring Your Brand to{" "}
            <span className="bg-linear-to-r from-fuchsia-500 to-purple-600 bg-clip-text text-transparent">
              Every Photo
            </span>
          </h3>

          <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-600 sm:text-base">
            Bring excitement to your store or event with our QR Photo Booth. Customers scan, click and share
            photos with your logo, so your brand travels with every post.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {perks.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm"
              >
                <Icon className="h-3.5 w-3.5 text-purple-500" /> {label}
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button className="flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-fuchsia-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-200 hover:opacity-90">
              Get a Quote <ArrowRight className="h-4 w-4" />
            </button>
            <Link
              to="/contact"
              className="flex items-center justify-center gap-2 rounded-full border border-purple-300 bg-white px-6 py-3 text-sm font-semibold text-purple-600 hover:bg-purple-50"
            >
              <Phone className="h-4 w-4" /> Call Us
            </Link>
          </div>
        </div>

        {/* Right: booth + checklist */}
        <div className="relative flex items-center justify-center gap-5 sm:gap-8">
          {/* QR booth illustration */}
          <div className="flex flex-col items-center">
            <div className="flex h-44 w-24 flex-col items-center justify-between rounded-2xl bg-linear-to-b from-slate-800 to-slate-950 p-3 shadow-2xl ring-1 ring-white/10 sm:h-52 sm:w-28">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-slate-200">
                <div className="h-4 w-4 rounded-full bg-slate-600 ring-2 ring-slate-500" />
              </div>
              <span className="text-[8px] font-bold tracking-wider text-white/70">THE BOOTH TREND</span>
              <div className="rounded-lg bg-white p-1.5">
                <QrCode className="h-10 w-10 text-slate-900" />
              </div>
              <span className="text-[9px] text-white/60">Scan &amp; Smile</span>
            </div>
            <div className="h-6 w-2 bg-slate-700" />
            <div className="h-1.5 w-16 rounded-full bg-slate-700" />
          </div>

          {/* Checklist card */}
          <div className="rounded-2xl bg-white/90 p-4 shadow-lg backdrop-blur sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-purple-500">Why choose us</p>
            <ul className="mt-3 space-y-2.5">
              {points.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <CircleCheck className="h-4 w-4 shrink-0 fill-purple-500 text-white" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}