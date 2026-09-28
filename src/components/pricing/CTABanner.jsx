import { ArrowRight } from "lucide-react";

export default function CTABanner() {
  return (
    <section className="bg-linear-to-r from-purple-50 via-fuchsia-50 to-orange-50 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 text-center md:flex-row md:justify-between md:text-left">
        <p className="font-serif text-lg italic text-purple-500">
          Make Every Moment
          <br />
          Special ♥
        </p>
        <div>
          <p className="text-lg font-bold text-slate-900">Ready to create unforgettable memories?</p>
          <p className="text-sm text-slate-500">
            Choose your plan today and start capturing the moments that matter.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-full bg-linear-to-r from-fuchsia-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-purple-200 hover:opacity-90">
          Get Started <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
