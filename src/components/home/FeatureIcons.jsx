import { Camera, CalendarDays, QrCode, Printer, Store, Share2 } from "lucide-react";

const features = [
  { icon: Camera, label: "Photo Frames", sub: "Beautiful Templates", tint: "bg-pink-100 text-pink-600", glow: "group-hover:shadow-pink-100" },
  { icon: CalendarDays, label: "Event Templates", sub: "Birthday, Wedding & More", tint: "bg-purple-100 text-purple-600", glow: "group-hover:shadow-purple-100" },
  { icon: QrCode, label: "QR Booth", sub: "Scan, Capture, Share", tint: "bg-sky-100 text-sky-600", glow: "group-hover:shadow-sky-100" },
  { icon: Printer, label: "Print Services", sub: "High Quality Prints", tint: "bg-emerald-100 text-emerald-600", glow: "group-hover:shadow-emerald-100" },
  { icon: Store, label: "Business Solutions", sub: "For Shops & Events", tint: "bg-orange-100 text-orange-600", glow: "group-hover:shadow-orange-100" },
  { icon: Share2, label: "Share Instantly", sub: "WhatsApp, Instagram & More", tint: "bg-violet-100 text-violet-600", glow: "group-hover:shadow-violet-100" },
];

export default function FeatureIcons() {
  return (
    <section id="features" className="bg-linear-to-r from-pink-50 via-purple-50 to-sky-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Heading */}
        {/* Heading */}
<div className="mb-8 text-left">
  <h2 className="mt-1 text-2xl font-black text-black sm:text-3xl">Our Features</h2>
 <p className="mt-2 max-w-md text-sm text-gray-400">
  Everything you need to capture, design and share your special moments
</p>
</div>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {features.map(({ icon: Icon, label, sub, tint, glow }) => (
            <div
              key={label}
              className={`group flex flex-col items-center rounded-2xl border border-white bg-white/80 p-5 text-center shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-lg ${glow}`}
            >
              <div
                className={`mb-3 flex h-14 w-14 items-center justify-center rounded-2xl ${tint} transition duration-300 group-hover:scale-110`}
              >
                <Icon className="h-6 w-6" strokeWidth={1.8} />
              </div>
              <p className="text-sm font-semibold text-slate-800">{label}</p>
              <p className="mt-0.5 text-xs leading-snug text-slate-500">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}