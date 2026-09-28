import { Heart } from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import Logo from "./Logo";

const quickLinks = ["Home", "Templates", "For Businesses", "Pricing"];
const supportLinks = ["Help Center", "Contact Us", "FAQs", "Privacy Policy"];
const socials = [
  { Icon: FaFacebook, href: "https://www.facebook.com/profile.php?id=61594372002146" },
  { Icon: FaInstagram, href: "https://www.instagram.com/boothtrend.com2026/" },
  { Icon: FaYoutube, href: "https://www.youtube.com/@BOOTHTREND" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 py-6 text-slate-400">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo light />
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-white">Quick Links</p>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((l) => (
                <li key={l}>
                  <a href="#" className="hover:text-white">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-white">Support</p>
            <ul className="space-y-2 text-sm">
              {supportLinks.map((l) => (
                <li key={l}>
                  <a href="#" className="hover:text-white">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-white">Follow Us</p>
            <div className="flex gap-3">
              {socials.map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                >
                  <Icon className="h-4 w-4 text-white" />
                </a>
              ))}
            </div>
            <p className="mt-4 font-serif italic text-purple-300">
              Moments
              <br />
              Made Special! <Heart className="inline h-4 w-4 fill-purple-300 text-purple-300" />
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs sm:flex-row">
          <p>© 2026 The Booth Trend. All rights reserved.</p>
          <p>www.boothtrend.com</p>
        </div>
      </div>
    </footer>
  );
}
