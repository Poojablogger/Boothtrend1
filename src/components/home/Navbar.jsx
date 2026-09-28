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
          
          <button className="rounded-full bg-linear-to-r from-fuchsia-500 to-purple-600 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-purple-200 hover:opacity-90">
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}