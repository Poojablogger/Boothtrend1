import { CircleCheck, ArrowRight } from "lucide-react";
import wedding from "../../assets/wedding.jpeg";
import birthday from "../../assets/birthday.jpeg";
import events from "../../assets/events.jpeg";
import festival from "../../assets/festival.jpeg";
import friends from "../../assets/friends.jpeg";

const themes = {
  blue: {
    card: "bg-gradient-to-b from-sky-50 to-white border-sky-200",
    badge: "bg-sky-600",
    priceBox: "border-sky-300 text-sky-600",
    tagline: "text-sky-500",
    check: "text-sky-600",
    button: "bg-sky-600 hover:bg-sky-700",
  },
  purple: {
    card: "bg-gradient-to-b from-purple-50 to-white border-purple-200",
    badge: "bg-purple-600",
    priceBox: "border-purple-300 text-purple-600",
    tagline: "text-purple-500",
    check: "text-purple-600",
    button: "bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:opacity-90",
  },
  orange: {
    card: "bg-gradient-to-b from-orange-50 to-white border-orange-200",
    badge: "bg-orange-500",
    priceBox: "border-orange-300 text-orange-600",
    tagline: "text-orange-500",
    check: "text-orange-500",
    button: "bg-orange-500 hover:bg-orange-600",
  },
};

const plans = [
  {
    theme: "blue",
    option: "Option 1",
    title: "Business Plan",
    subtitle: "Grow your business with stylish templates",
    price: "299",
    tagline: "Simple Creative Affordable",
    thumbs: [
      { img: wedding, label: "Together Forever" },
      { img: birthday, label: "Happy Birthday" },
    ],
    moreLabel: "+2 More",
    features: [
      { title: "2 Templates Included", sub: "(4 templates available in actual, you can choose any 2)" },
      { title: "Beautiful template designs with filters" },
      { title: "Easy to customize with your photos & text" },
      { title: "Suitable for small events", sub: "(Birthday, Anniversary, etc.)" },
    ],
  },
  {
    theme: "purple",
    option: "Option 2",
    title: "Premium Plan",
    subtitle: "More templates, more styles with AI",
    price: "499",
    tagline: "More Creative More Possibilities",
    thumbs: [
      { img: wedding, label: "Our Wedding" },
      { img: birthday, label: "Happy Birthday" },
      { img: events, label: "Grand Opening" },
    ],
    moreLabel: "+6 More",
    features: [
      { title: "8 Templates Included", sub: "(Different styles for all occasions)" },
      { title: "AI Integration Templates", sub: "(Smart suggestions & auto design)" },
      { title: "Wide range of templates with advanced filters" },
      { title: "Easy customization with photos, text & effects" },
      { title: "Suitable for all event types", sub: "(Birthday, Wedding, Business, etc.)" },
    ],
  },
  {
    theme: "orange",
    option: "Option 3",
    title: "Festival Plan",
    subtitle: "Special templates for all festivals & special occasions",
    price: "4999",
    tagline: "Every Festival A Special Memory",
    thumbs: [
      { img: festival, label: "Happy Diwali" },
      { img: friends, label: "Happy Pongal" },
      { img: events, label: "Happy Navratri" },
      { img: wedding, label: "Merry Christmas" },
    ],
    moreLabel: "+ Many More Festival Templates",
    features: [
      { title: "Festival Templates Collection" },
      { title: "Includes major Indian festivals", sub: "(Diwali, Pongal, Navratri, Christmas, Eid, New Year, etc.)" },
      { title: "Beautiful festive designs with filters" },
      { title: "Easy to customize with your photos & greetings" },
      { title: "Perfect for seasonal campaigns, business promotions & customer engagement" },
    ],
  },
];

function PlanCard({ plan }) {
  const t = themes[plan.theme];

  return (
    <div className="pt-9">
      <div className={`relative rounded-3xl border p-6 shadow-sm ${t.card}`}>
        <span className={`absolute -top-3 left-6 rounded-full px-3 py-1 text-xs font-semibold text-white ${t.badge}`}>
          {plan.option}
        </span>

        <h3 className="mt-4 text-2xl font-extrabold text-slate-900">{plan.title}</h3>
        <p className="mt-1 text-sm text-slate-500">{plan.subtitle}</p>

        <div className="mt-5 flex items-center justify-between">
          <div className={`rounded-xl border-2 px-4 py-2 text-center font-extrabold ${t.priceBox}`}>
            <p className="text-xl leading-none">₹{plan.price}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide">Only</p>
          </div>
          <p className={`max-w-28 rotate-1 font-serif text-sm italic leading-tight ${t.tagline}`}>
            {plan.tagline}
          </p>
        </div>

        <div className="mt-5 flex gap-2">
          {plan.thumbs.map((th) => (
            <div key={th.label} className="w-14 shrink-0 overflow-hidden rounded-lg shadow-sm">
              <img src={th.img} alt={th.label} className="aspect-3/4 h-full w-full object-cover" />
            </div>
          ))}
          <div className="flex aspect-3/4 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-800 p-1 text-center text-[9px] font-semibold leading-tight text-white">
            {plan.moreLabel}
          </div>
        </div>

        <ul className="mt-6 space-y-3">
          {plan.features.map((f) => (
            <li key={f.title} className="flex gap-2 text-sm">
              <CircleCheck className={`mt-0.5 h-4 w-4 shrink-0 ${t.check}`} />
              <span className="text-slate-700">
                {f.title}
                {f.sub && <span className="block text-xs text-slate-400">{f.sub}</span>}
              </span>
            </li>
          ))}
        </ul>

        <button
          className={`mt-6 flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-md ${t.button}`}
        >
          Choose this plan <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function PricingCards() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-16">
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard key={plan.title} plan={plan} />
        ))}
      </div>
    </section>
  );
}
