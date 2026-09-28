import { useEffect, useRef, useState } from "react";
import { Users, Image, Store, Heart, BadgeCheck } from "lucide-react";

// end = the number to count to, suffix = what shows after it
const stats = [
  { icon: Users, end: 10000, suffix: "+", label: "Happy Users" },
  { icon: Image, end: 1000, suffix: "+", label: "Templates" },
  { icon: Store, end: 500, suffix: "+", label: "Event Partners" },
  { icon: Heart, end: 1, suffix: "M+", label: "Memories Created" },
  { icon: BadgeCheck, end: 500, suffix: "K+", label: "Happy Vendors" },
];

/* One number that counts up from 0 */
function Counter({ end, suffix, start }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    let frame;

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // slows down near the end
      setValue(Math.round(eased * end));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, end]);

  return (
    <>
      {value.toLocaleString("en-IN")}
      {suffix}
    </>
  );
}

export default function Stats() {
  const sectionRef = useRef(null);
  const [start, setStart] = useState(false);

  // Start counting when the section scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStart(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-3 rounded-2xl border border-purple-100 bg-white p-4 shadow-sm"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-500">
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-extrabold text-slate-900 tabular-nums sm:text-xl">
                <Counter end={s.end} suffix={s.suffix} start={start} />
              </p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}