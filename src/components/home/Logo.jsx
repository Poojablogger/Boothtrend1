import logo from "../../assets/logo2.jpeg";

/* Infinity symbol that replaces the "oo" in Booth */
function Infinity() {
  return (
    <svg
      viewBox="6 3 88 44"
      className="mx-[0.02em] inline-block h-[0.6em] w-auto"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bt-infinity" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FF1A6E" />
          <stop offset="30%" stopColor="#E02AC8" />
          <stop offset="50%" stopColor="#8B5CF0" />
          <stop offset="72%" stopColor="#1EC8F5" />
          <stop offset="100%" stopColor="#0A8CF0" />
        </linearGradient>
      </defs>
      <path
        d="M50 25 C38 4, 12 4, 12 25 C12 46, 38 46, 50 25 C62 4, 88 4, 88 25 C88 46, 62 46, 50 25 Z"
        fill="none"
        stroke="url(#bt-infinity)"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      {/* Camera icon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl">
        <img src={logo} alt="" className="h-full w-full object-cover" />
      </div>

      {/* BoothTrend word */}
      <p
        className="font-['Poppins'] text-2xl font-extrabold leading-none tracking-[-0.04em]"
        aria-label="BoothTrend"
      >
        <span className="text-[#0086F9]">
          B<Infinity />th
        </span>
        <span className="text-[#FC1286]">Trend</span>
      </p>
    </div>
  );
}