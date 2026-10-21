import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Features", path: "#" },
  { label: "Templates", path: "/gallery" },
  { label: "For Businesses", path: "#" },
  { label: "Pricing", path: "/pricing" },
  { label: "Contact Us", path: "/contact" },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Logo />

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => {
            const isActive = link.path !== "#" && location.pathname === link.path;
            return (
              <Link
                key={link.label}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActive ? "text-purple-600" : "text-slate-600 hover:text-purple-600"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {/* AI Prompt button */}
          <Link
            to="/ai-prompts"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/40 bg-linear-to-r from-violet-500 via-fuchsia-500 to-purple-500 px-6 py-2.5 text-base font-bold text-white shadow-[0_8px_24px_-4px_rgba(192,38,211,0.55)] ring-1 ring-purple-300/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-4px_rgba(192,38,211,0.7)] active:translate-y-0"
          >
            {/* soft shine on top */}
            <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-white/15" />

            {/* small white dots */}
            <span className="pointer-events-none absolute left-3 top-1.5 h-1.5 w-1.5 rounded-full bg-white/80" />
            <span className="pointer-events-none absolute bottom-1.5 right-3 h-1.5 w-1.5 rounded-full bg-white/80" />

            <span className="relative text-lg leading-none transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
              ✨
            </span>
            <span className="relative">AI Prompt</span>
          </Link>
        </div>
      </div>
    </header>
  );
}