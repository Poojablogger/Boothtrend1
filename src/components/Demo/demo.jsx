import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Camera, Video, RefreshCw, ArrowLeft, Download, Share2, RotateCcw, X, Home } from "lucide-react";
import { FaWhatsapp, FaInstagram, FaFacebookF } from "react-icons/fa";
import { TEMPLATES, CANVAS_W, CANVAS_H } from "./templates";

const MAX_VIDEO_SECONDS = 15;
const STEPS = ["Choose frame", "Shoot", "Share"];

// mp4 first: WhatsApp and Instagram accept it directly. Chrome 126+ and Safari support it.
function pickMimeType() {
  if (typeof MediaRecorder === "undefined") return null;
  const types = [
    "video/mp4;codecs=avc1,mp4a",
    "video/mp4",
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ];
  return types.find((t) => MediaRecorder.isTypeSupported(t)) ?? "";
}

// Draw the camera feed into the template's photo window, cropped like CSS object-fit: cover
function drawVideoCover(ctx, video, win, mirror) {
  const vw = video.videoWidth;
  const vh = video.videoHeight;
  if (!vw || !vh) return;
  const target = win.w / win.h;
  let sx = 0, sy = 0, sw = vw, sh = vh;
  if (vw / vh > target) {
    sw = vh * target;
    sx = (vw - sw) / 2;
  } else {
    sh = vw / target;
    sy = (vh - sh) / 2;
  }
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(win.x, win.y, win.w, win.h, win.r);
  ctx.clip();
  if (mirror) {
    ctx.translate(win.x + win.w, win.y);
    ctx.scale(-1, 1);
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, win.w, win.h);
  } else {
    ctx.drawImage(video, sx, sy, sw, sh, win.x, win.y, win.w, win.h);
  }
  ctx.restore();
}

// Small preview of a frame with a placeholder person in the photo area
function TemplateThumb({ template, caption, subtext }) {
  const ref = useRef(null);
  useEffect(() => {
    const ctx = ref.current.getContext("2d");
    ctx.setTransform(0.25, 0, 0, 0.25, 0, 0);
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    const w = template.window;
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(w.x, w.y, w.w, w.h, w.r);
    ctx.clip();
    const g = ctx.createLinearGradient(0, w.y, 0, w.y + w.h);
    g.addColorStop(0, "#EDE4FB");
    g.addColorStop(1, "#C9B6EE");
    ctx.fillStyle = g;
    ctx.fillRect(w.x, w.y, w.w, w.h);
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    const cx = w.x + w.w / 2;
    ctx.beginPath();
    ctx.arc(cx, w.y + w.h * 0.42, w.w * 0.14, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx, w.y + w.h, w.w * 0.3, w.h * 0.32, 0, Math.PI, 0);
    ctx.fill();
    ctx.restore();
    template.draw(ctx, { caption, subtext });
  }, [template, caption, subtext]);
  return <canvas ref={ref} width={CANVAS_W / 4} height={CANVAS_H / 4} className="block h-auto w-full" />;
}

export default function BoothDemo() {
  const [step, setStep] = useState(0);
  const [templateId, setTemplateId] = useState(TEMPLATES[0].id);
  const [caption, setCaption] = useState(TEMPLATES[0].caption);
  const [subtext, setSubtext] = useState(TEMPLATES[0].subtext);
  const [chooserOpen, setChooserOpen] = useState(false);
  const [mode, setMode] = useState("photo");
  const [facing, setFacing] = useState("user");
  const [attempt, setAttempt] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recSeconds, setRecSeconds] = useState(0);
  const [flash, setFlash] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(0);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  // The draw loop reads from this ref so typing a caption doesn't restart the camera
  const settingsRef = useRef({});
  settingsRef.current = { templateId, caption, subtext, facing };

  const template = TEMPLATES.find((t) => t.id === templateId);

  // Clicking a template opens the "Photo or Video?" chooser
  const openTemplate = (t) => {
    if (t.id !== templateId) {
      setTemplateId(t.id);
      setCaption(t.caption);
      setSubtext(t.subtext);
    }
    setChooserOpen(true);
  };

  const startShoot = (chosenMode) => {
    setMode(chosenMode);
    setChooserOpen(false);
    setStep(1);
  };

  // Chooser: close on Escape and stop the page scrolling behind it
  useEffect(() => {
    if (!chooserOpen) return;
    const onKey = (e) => e.key === "Escape" && setChooserOpen(false);
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [chooserOpen]);

  // Camera + render loop, only while on the Shoot step
  useEffect(() => {
    if (step !== 1) return;
    let cancelled = false;

    async function start() {
      setError("");
      if (!navigator.mediaDevices?.getUserMedia) {
        setError("This browser can't open the camera. Open the site in Chrome or Safari over https.");
        return;
      }
      const video = { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 1280 } };
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video, audio: true });
      } catch {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video, audio: false });
        } catch {
          if (!cancelled) setError("Camera access is blocked. Allow the camera for this site in your browser settings, then tap Try again.");
          return;
        }
      }
      if (cancelled) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      streamRef.current = stream;
      const v = videoRef.current;
      v.srcObject = stream;
      await v.play().catch(() => {});

      const draw = () => {
        const c = canvasRef.current;
        if (c && v.readyState >= 2) {
          const ctx = c.getContext("2d");
          const s = settingsRef.current;
          const t = TEMPLATES.find((x) => x.id === s.templateId);
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.fillStyle = "#000";
          ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
          drawVideoCover(ctx, v, t.window, s.facing === "user");
          t.draw(ctx, s);
        }
        rafRef.current = requestAnimationFrame(draw);
      };
      draw();
    }

    start();
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [step, facing, attempt]);

  // Clean up timers and blob URLs
  useEffect(() => () => clearInterval(timerRef.current), []);
  useEffect(() => () => result && URL.revokeObjectURL(result.url), [result]);

  const finish = (blob, type) => {
    setResult({ type, blob, url: URL.createObjectURL(blob) });
    setNotice("");
    setStep(2);
  };

  const takePhoto = () => {
    if (countdown !== null) return;
    let n = 3;
    setCountdown(n);
    timerRef.current = setInterval(() => {
      n -= 1;
      if (n > 0) {
        setCountdown(n);
        return;
      }
      clearInterval(timerRef.current);
      setCountdown(null);
      setFlash(true);
      setTimeout(() => setFlash(false), 180);
      canvasRef.current.toBlob((blob) => blob && finish(blob, "photo"), "image/jpeg", 0.92);
    }, 1000);
  };

  const startRecording = () => {
    const mime = pickMimeType();
    if (mime === null || !canvasRef.current.captureStream) {
      setError("This browser can't record video. Try Chrome, or switch to Photo.");
      return;
    }
    // Record the canvas (camera + frame together), plus the mic
    const out = canvasRef.current.captureStream(30);
    streamRef.current?.getAudioTracks().forEach((t) => out.addTrack(t));
    const rec = new MediaRecorder(out, mime ? { mimeType: mime, videoBitsPerSecond: 5_000_000 } : undefined);
    chunksRef.current = [];
    rec.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
    rec.onstop = () => {
      clearInterval(timerRef.current);
      setRecording(false);
      const type = (rec.mimeType || "video/webm").split(";")[0];
      finish(new Blob(chunksRef.current, { type }), "video");
    };
    rec.start(250);
    recorderRef.current = rec;
    setRecording(true);
    setRecSeconds(0);
    const started = Date.now();
    timerRef.current = setInterval(() => {
      const s = Math.floor((Date.now() - started) / 1000);
      setRecSeconds(s);
      if (s >= MAX_VIDEO_SECONDS && rec.state !== "inactive") rec.stop();
    }, 250);
  };

  const stopRecording = () => {
    const r = recorderRef.current;
    if (r && r.state !== "inactive") r.stop();
  };

  const onShutter = () => {
    if (mode === "photo") takePhoto();
    else if (recording) stopRecording();
    else startRecording();
  };

  const fileName = () => {
    const t = result.blob.type;
    const ext = t.includes("mp4") ? "mp4" : t.includes("webm") ? "webm" : "jpg";
    return `boothtrend-${Date.now()}.${ext}`;
  };

  const saveToDevice = () => {
    const a = document.createElement("a");
    a.href = result.url;
    a.download = fileName();
    a.click();
  };

  // On phones this opens the share sheet, where WhatsApp, Instagram and Facebook appear.
  // On desktop browsers without file sharing, save the file and open the site instead.
  const share = async (app) => {
    const file = new File([result.blob], fileName(), { type: result.blob.type });
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: "The Booth Trend", text: caption });
        setNotice("Shared.");
      } catch (e) {
        if (e.name !== "AbortError") setNotice("Sharing didn't finish. Save to device and post it from your gallery.");
      }
      return;
    }
    saveToDevice();
    const sites = {
      whatsapp: "https://web.whatsapp.com/",
      instagram: "https://www.instagram.com/",
      facebook: "https://www.facebook.com/",
    };
    if (app) window.open(sites[app], "_blank", "noopener");
    setNotice("Saved to your downloads. Attach it from there to post.");
  };

  const retake = () => {
    setResult(null);
    setStep(1);
  };

  const mmss = (s) => `0:${String(s).padStart(2, "0")}`;

  const primaryBtn =
    "flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-fuchsia-500 to-purple-600 py-3.5 font-semibold text-white shadow-lg shadow-purple-200 hover:opacity-90 focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-200";
  const secondaryBtn =
    "flex items-center justify-center gap-2 rounded-xl border border-purple-200 bg-white py-3 text-sm font-semibold text-purple-700 hover:bg-purple-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-200";
  const choiceBtn =
    "flex flex-col items-center gap-2 rounded-2xl border-2 border-purple-200 bg-purple-50/60 px-3 py-4 text-center transition hover:border-purple-500 hover:bg-purple-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-200";
  const roundIconBtn =
    "grid h-12 w-12 place-items-center rounded-full border border-purple-200 bg-white text-purple-600 hover:bg-purple-50 disabled:opacity-30";
  const inputClass =
    "w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100";

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Hidden but still decoding, which iOS needs */}
      <video ref={videoRef} playsInline muted className="pointer-events-none absolute h-px w-px opacity-0" />

      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-purple-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-purple-600">
            <Home size={18} />
            <span className="hidden sm:inline">Home</span>
          </Link>

          <span className="bg-linear-to-r from-fuchsia-500 to-purple-600 bg-clip-text text-base font-extrabold text-transparent sm:text-lg">
            The Booth Trend
          </span>

          <ol className="flex items-center gap-1.5 sm:gap-3">
            {STEPS.map((label, i) => (
              <li key={label} className="flex items-center gap-1.5">
                <span
                  className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold ${
                    i === step
                      ? "bg-linear-to-r from-fuchsia-500 to-purple-600 text-white"
                      : i < step
                      ? "bg-purple-100 text-purple-600"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {i + 1}
                </span>
                <span className={`hidden text-xs font-medium md:inline ${i === step ? "text-purple-700" : "text-slate-400"}`}>
                  {label}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </header>

      {/* STEP 1: choose a frame */}
      {step === 0 && (
        <main className="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-6">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Choose your frame</h1>
            <p className="mx-auto mt-2 max-w-md text-slate-500">
              Tap a design, add your names or message, then take a photo or record a video.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => openTemplate(t)}
                className="group rounded-2xl border border-slate-200 bg-white p-2 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-200"
              >
                <div className="overflow-hidden rounded-xl bg-slate-50">
                  <TemplateThumb template={t} caption={t.caption} subtext={t.subtext} />
                </div>
                <div className="flex items-center justify-between px-1.5 pb-1 pt-2.5">
                  <span className="text-sm font-semibold text-slate-800">{t.name}</span>
                  <span className="text-xs font-semibold text-purple-600 opacity-0 transition group-hover:opacity-100">Use</span>
                </div>
              </button>
            ))}
          </div>
        </main>
      )}

      {/* Chooser: Photo or Video */}
      {chooserOpen && (
        <div
          className="fixed inset-0 z-30 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setChooserOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="chooser-title"
            onClick={(e) => e.stopPropagation()}
            className="chooser-in max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-2xl sm:rounded-3xl sm:p-7"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 id="chooser-title" className="text-xl font-bold">
                {template.name}
              </h2>
              <button
                onClick={() => setChooserOpen(false)}
                aria-label="Close"
                className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-[220px_1fr] sm:gap-7">
              {/* Live preview with the text they type */}
              <div className="mx-auto w-44 overflow-hidden rounded-xl border border-slate-200 shadow-sm sm:w-full">
                <TemplateThumb template={template} caption={caption} subtext={subtext} />
              </div>

              <div className="flex flex-col">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-600">Main text</span>
                  <input value={caption} onChange={(e) => setCaption(e.target.value)} maxLength={40} className={inputClass} />
                </label>
                <label className="mt-3 block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-600">Small text</span>
                  <input value={subtext} onChange={(e) => setSubtext(e.target.value)} maxLength={50} className={inputClass} />
                </label>

                <p className="mb-2.5 mt-5 text-sm font-medium text-slate-600">What do you want to capture?</p>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => startShoot("photo")} className={choiceBtn}>
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-linear-to-r from-fuchsia-500 to-purple-600 text-white">
                      <Camera size={20} />
                    </span>
                    <span className="font-semibold text-slate-900">Take photo</span>
                    <span className="text-xs text-slate-500">3 second timer</span>
                  </button>
                  <button onClick={() => startShoot("video")} className={choiceBtn}>
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-linear-to-r from-fuchsia-500 to-purple-600 text-white">
                      <Video size={20} />
                    </span>
                    <span className="font-semibold text-slate-900">Record video</span>
                    <span className="text-xs text-slate-500">Up to {MAX_VIDEO_SECONDS} seconds</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: shoot */}
      {step === 1 && (
        <main className="mx-auto max-w-md px-4 pb-12 pt-6">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 shadow-xl shadow-purple-100">
            <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} className="block h-auto w-full" />

            {countdown !== null && (
              <div className="absolute inset-0 grid place-items-center text-[9rem] font-black text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                {countdown}
              </div>
            )}
            {flash && <div className="absolute inset-0 bg-white" />}
            {recording && (
              <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-slate-800 shadow">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
                {mmss(recSeconds)} / {mmss(MAX_VIDEO_SECONDS)}
              </div>
            )}
            {error && (
              <div className="absolute inset-0 grid place-items-center bg-white p-6 text-center">
                <div>
                  <p className="mb-4 text-slate-600">{error}</p>
                  <button onClick={() => setAttempt((a) => a + 1)} className={`${secondaryBtn} mx-auto px-6`}>
                    Try again
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Photo / Video switch */}
          <div className="mx-auto mt-5 flex w-fit rounded-full bg-slate-100 p-1 text-sm font-semibold">
            {[
              ["photo", "Photo", Camera],
              ["video", "Video", Video],
            ].map(([id, label, Icon]) => (
              <button
                key={id}
                disabled={recording || countdown !== null}
                onClick={() => setMode(id)}
                className={`flex items-center gap-1.5 rounded-full px-5 py-1.5 transition ${
                  mode === id ? "bg-white text-purple-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center justify-between px-6">
            <button
              onClick={() => setStep(0)}
              disabled={recording || countdown !== null}
              aria-label="Back to frames"
              className={roundIconBtn}
            >
              <ArrowLeft size={22} />
            </button>

            <button
              onClick={onShutter}
              aria-label={mode === "photo" ? "Take photo" : recording ? "Stop recording" : "Start recording"}
              className="grid h-20 w-20 place-items-center rounded-full border-4 border-purple-200 bg-white shadow-lg shadow-purple-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-300"
            >
              <span
                className={`block transition-all ${
                  mode === "video"
                    ? recording
                      ? "h-7 w-7 rounded-md bg-red-500"
                      : "h-14 w-14 rounded-full bg-red-500"
                    : "h-14 w-14 rounded-full bg-linear-to-br from-fuchsia-500 to-purple-600"
                }`}
              />
            </button>

            <button
              onClick={() => setFacing((f) => (f === "user" ? "environment" : "user"))}
              disabled={recording}
              aria-label="Flip camera"
              className={roundIconBtn}
            >
              <RefreshCw size={22} />
            </button>
          </div>
          <p className="mt-4 text-center text-sm text-slate-400">
            {mode === "photo"
              ? "Tap the button and smile. The photo is taken after 3 seconds."
              : recording
              ? "Tap the button again to stop."
              : `Tap the button to start recording, up to ${MAX_VIDEO_SECONDS} seconds.`}
          </p>
        </main>
      )}

      {/* STEP 3: share */}
      {step === 2 && result && (
        <main className="mx-auto max-w-md px-4 pb-12 pt-6">
          <h1 className="mb-4 text-center text-2xl font-extrabold tracking-tight">
            {result.type === "photo" ? "Your photo is ready" : "Your video is ready"}
          </h1>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-xl shadow-purple-100">
            {result.type === "photo" ? (
              <img src={result.url} alt={`${template.name} photo`} className="block h-auto w-full" />
            ) : (
              <video src={result.url} controls playsInline autoPlay loop className="block h-auto w-full" />
            )}
          </div>

          <button onClick={() => share()} className={`${primaryBtn} mt-6`}>
            <Share2 size={20} /> Share
          </button>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <button
              onClick={() => share("whatsapp")}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              <FaWhatsapp size={18} /> WhatsApp
            </button>
            <button
              onClick={() => share("instagram")}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-linear-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              <FaInstagram size={18} /> Instagram
            </button>
            <button
              onClick={() => share("facebook")}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-[#1877F2] py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              <FaFacebookF size={16} /> Facebook
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button onClick={saveToDevice} className={secondaryBtn}>
              <Download size={18} /> Save to device
            </button>
            <button onClick={retake} className={secondaryBtn}>
              <RotateCcw size={18} /> Retake
            </button>
          </div>

          <button
            onClick={() => {
              setResult(null);
              setStep(0);
            }}
            className="mx-auto mt-5 block text-sm font-semibold text-purple-600 hover:underline"
          >
            Choose another frame
          </button>

          {notice && <p className="mt-4 text-center text-sm font-medium text-purple-700">{notice}</p>}
        </main>
      )}

      <style>{`
        .chooser-in { animation: chooserIn 0.25s ease-out; }
        @keyframes chooserIn { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .chooser-in { animation: none; } }
      `}</style>
    </div>
  );
}