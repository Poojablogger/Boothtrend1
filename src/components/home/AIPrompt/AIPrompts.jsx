import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Heart, Copy, Check, X, RefreshCw } from "lucide-react";
import { social9Post } from "../../../config/api";

/* ---------- helpers: handle different response shapes safely ---------- */
function toList(json) {
  if (Array.isArray(json)) return json;
  if (Array.isArray(json?.data)) return json.data;
  if (Array.isArray(json?.result)) return json.result;
  if (Array.isArray(json?.data?.data)) return json.data.data;
  return [];
}

function normalizeTitle(t) {
  return {
    id: t.id ?? t.title_id ?? t.prompt_title_id,
    name: t.title ?? t.title_name ?? t.prompt_title ?? t.name ?? "Untitled",
  };
}

function normalizeImage(img) {
  return {
    id: img.id ?? img.image_id,
    titleId: img.title_id ?? img.prompt_title_id,
    name: img.image_title ?? img.prompt_name ?? img.name ?? img.title ?? "AI Prompt",
    image: img.image ?? img.prompt_image ?? img.image_url ?? img.img ?? "",
    prompt: img.prompt ?? img.prompt_text ?? img.description ?? "",
    likes: Number(img.likes ?? img.like_count ?? 0),
    date: img.created_at ?? img.createdAt ?? img.date ?? null,
  };
}

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d)) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

/* ---------- page ---------- */
export default function AIPrompts() {
  const [titles, setTitles] = useState([]);
  const [activeId, setActiveId] = useState(""); // "" = All
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Category pills
  useEffect(() => {
    social9Post("aiPromptTitle", { req_type: "1", action: "get" })
      .then((json) => setTitles(toList(json).map(normalizeTitle).filter((t) => t.id != null)))
      .catch((err) => console.error("aiPromptTitle:", err));
  }, []);

  // Images for the selected category ("" title_id = all)
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    // Same params as aiPromptTitle (req_type + action). Only send title_id when a
    // category is selected - an empty title_id can cause a 400 on the server.
    const params = { req_type: "1", action: "get" };
    if (activeId !== "" && activeId != null) params.title_id = String(activeId);

    social9Post("aiPromptImages", params)
      .then((json) => {
        if (!cancelled) setImages(toList(json).map(normalizeImage));
      })
      .catch((err) => {
        console.error("aiPromptImages:", err);
        if (!cancelled) {
          setImages([]);
          setError("Couldn't load prompts. Check your connection and try again.");
        }
      })
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [activeId, reloadKey]);

  const pills = useMemo(() => [{ id: "", name: "All" }, ...titles], [titles]);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-6 sm:px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-purple-600"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* Heading */}
        <header className="mt-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            Imagine It. Prompt It. Create It.{" "}
            <span className="bg-linear-to-r from-[#0086F9] to-[#FC1286] bg-clip-text text-transparent">
              BoothTrend
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-500 sm:text-base">
            Discover a collection of creative, ready-to-use prompts for stunning portraits, cinematic
            edits, special moments, professional visuals, and imaginative AI creations.
          </p>
        </header>

        {/* Category pills */}
        <div className="mt-10 flex flex-wrap justify-center gap-2.5 sm:gap-3">
          {pills.map((p) => {
            const active = String(p.id) === String(activeId);
            return (
              <button
                key={p.id || "all"}
                type="button"
                onClick={() => setActiveId(p.id)}
                className={`rounded-full border px-5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-200 ${
                  active
                    ? "border-purple-600 bg-purple-600 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-purple-300 hover:text-purple-600"
                }`}
              >
                {p.name}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <section className="mt-10">
          {loading ? (
            <div className="columns-2 gap-4 sm:gap-6 md:columns-3 lg:columns-4">
              {[320, 260, 300, 280, 240, 340, 270, 310].map((h, i) => (
                <div key={i} className="mb-6 break-inside-avoid">
                  <div className="animate-pulse rounded-2xl bg-slate-100" style={{ height: h }} />
                  <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-slate-100" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="py-16 text-center">
              <p className="text-slate-600">{error}</p>
              <button
                onClick={() => setReloadKey((k) => k + 1)}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-purple-600 px-5 py-2 text-sm font-semibold text-white hover:bg-purple-700"
              >
                <RefreshCw size={16} /> Try again
              </button>
            </div>
          ) : images.length === 0 ? (
            <p className="py-16 text-center text-slate-500">
              No prompts in this category yet. Pick another category above.
            </p>
          ) : (
            <div className="columns-2 gap-4 sm:gap-6 md:columns-3 lg:columns-4">
              {images.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setSelected(img)}
                  className="group mb-6 block w-full break-inside-avoid text-left focus-visible:outline-none"
                >
                  <div className="overflow-hidden rounded-2xl bg-slate-100 group-focus-visible:ring-4 group-focus-visible:ring-purple-300">
                    <img
                      src={img.image}
                      alt={img.name}
                      loading="lazy"
                      className="w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                  <h3 className="mt-3 truncate px-1 text-sm font-semibold text-slate-900 sm:text-base">
                    {img.name}
                  </h3>
                  <div className="mt-1 flex items-center justify-between px-1 text-xs text-slate-500 sm:text-sm">
                    <span className="flex items-center gap-1">
                      <Heart size={14} className="fill-slate-400 text-slate-400" /> {img.likes}
                    </span>
                    <span>{formatDate(img.date)}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>

      {selected && <PromptModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

/* ---------- popup: big image + prompt + copy button ---------- */
function PromptModal({ item, onClose }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(item.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative grid max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-slate-700 shadow hover:bg-white"
        >
          <X size={18} />
        </button>

        <div className="bg-slate-100">
          <img src={item.image} alt={item.name} className="h-full max-h-[45vh] w-full object-contain md:max-h-[90vh]" />
        </div>

        <div className="flex flex-col overflow-y-auto p-6">
          <h2 className="pr-8 text-xl font-bold text-slate-900">{item.name}</h2>
          <div className="mt-2 flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Heart size={14} className="fill-slate-400 text-slate-400" /> {item.likes}
            </span>
            <span>{formatDate(item.date)}</span>
          </div>

          <p className="mt-5 text-sm font-semibold text-slate-700">Prompt</p>
          <div className="mt-2 flex-1 whitespace-pre-wrap rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
            {item.prompt || "No prompt text for this image."}
          </div>

          {item.prompt && (
            <button
              onClick={copy}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-fuchsia-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-200 hover:opacity-95"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Prompt copied" : "Copy prompt"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}