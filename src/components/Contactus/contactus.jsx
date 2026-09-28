import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Send,
  Camera,
  Sparkles,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    business: "",
    service: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Contact Form:", formData);

    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <main className="min-h-screen bg-[#FFF9F2] px-4 py-8 font-sans sm:px-6 lg:px-10">

      {/* =====================================================
          BACK BUTTON
      ====================================================== */}
      <div className="mx-auto mb-6 max-w-7xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="group inline-flex items-center gap-2 rounded-full border border-[#EBDCE5] bg-white px-5 py-2.5 text-sm font-semibold text-[#5B2A86] shadow-sm transition-all duration-300 hover:-translate-x-1 hover:border-[#C084FC] hover:bg-[#FAF5FF] hover:shadow-md"
        >
          <ArrowLeft
            size={18}
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />

          <span>Back</span>
        </button>
      </div>

      {/* =====================================================
          HERO SECTION
      ====================================================== */}
      <section className="mx-auto max-w-7xl text-center">

        {/* Main Heading */}
        <h1 className="font-sans text-5xl font-bold leading-tight text-[#5B2A86] sm:text-6xl lg:text-7xl">
          Bring Your Brand{" "}
          <span className="text-[#7C3AED]">to Life</span>
        </h1>

        {/* Underline */}
        <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#E98BB5]" />

        {/* Description */}
        <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-[#766C7D] sm:text-lg">
          Have a question about Booth Trends, custom templates, events,
          or business branding?
          <br className="hidden sm:block" />
          We'd love to hear from you.
        </p>
      </section>

      {/* =====================================================
          CONTACT SECTION
      ====================================================== */}
      <section className="mx-auto mt-14 grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">

        {/* ===================================================
            LEFT CONTACT CARD
        ==================================================== */}
        <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#5B2A86] via-[#7C3AED] to-[#E98BB5] p-8 text-white shadow-[0_25px_60px_rgba(124,58,237,0.20)] sm:p-10 lg:p-12">

          {/* Decorative Circle - Top Right */}
          <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-white/10" />

          {/* Decorative Circle - Bottom Left */}
          <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-white/10" />

          {/* Decorative Small Circle */}
          <div className="absolute bottom-28 right-16 h-20 w-20 rounded-full bg-pink-200/10" />

          {/* Floating Camera */}
          <div className="absolute right-8 top-8 rotate-12 text-white opacity-20">
            <Camera size={80} strokeWidth={1} />
          </div>

          {/* Decorative Sparkles */}
          <Sparkles
            size={24}
            className="absolute left-8 top-8 text-pink-200/40"
          />

          <Sparkles
            size={18}
            className="absolute bottom-36 right-12 text-white/30"
          />

          <div className="relative z-10">

            {/* Heading */}
            <h2 className="font-sans text-3xl font-bold leading-tight sm:text-4xl">
              Let's Create
              <br />
              Something Amazing
            </h2>

            {/* Description */}
            <p className="mt-5 max-w-md text-sm leading-7 text-[#FCE7F3] sm:text-base">
              From memorable events to powerful brand experiences,
              Booth Trends helps you turn every photo into a
              shareable moment.
            </p>

            {/* Contact Details */}
            <div className="mt-10 space-y-7">

              {/* Email */}
              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/15 backdrop-blur-sm">
                  <Mail size={21} />
                </div>

                <div>
                  <p className="text-xs font-semibold tracking-[0.15em] text-[#F6D6E5]">
                    EMAIL
                  </p>

                  <p className="mt-1 break-all text-sm font-semibold sm:text-base">
                    boothtrend.com@gmail.com
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/15 backdrop-blur-sm">
                  <Phone size={21} />
                </div>

                <div>
                  <p className="text-xs font-semibold tracking-[0.15em] text-[#F6D6E5]">
                    PHONE
                  </p>

                  <p className="mt-1 text-sm font-semibold sm:text-base">
                    +91 98426 50889
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/15 backdrop-blur-sm">
                  <MapPin size={21} />
                </div>

                <div>
                  <p className="text-xs font-semibold tracking-[0.15em] text-[#F6D6E5]">
                    LOCATION
                  </p>

                  <p className="mt-1 text-sm font-semibold sm:text-base">
                    Tamil Nadu, India
                  </p>
                </div>
              </div>
            </div>

            {/* Tagline Box */}
            <div className="mt-10 rounded-2xl border border-white/15 bg-white/10 p-7 text-center shadow-inner backdrop-blur-md">

              <Camera
                className="mx-auto mb-4 text-[#FCE7F3]"
                size={25}
              />

              <p className="font-sans text-lg italic text-white sm:text-xl">
                "Capture • Customize • Celebrate"
              </p>

              <p className="mt-3 text-xs text-[#F6D6E5]">
                Turn every moment into a memorable brand experience.
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================
            RIGHT FORM CARD
        ==================================================== */}
        <div className="rounded-[30px] border border-[#F0DDE7] bg-[#FFFDF9] p-7 shadow-[0_20px_60px_rgba(91,42,134,0.08)] sm:p-10 lg:p-12">

          {/* Form Header */}
          <div className="mb-8">

            <h2 className="font-sans text-3xl font-bold text-[#5B2A86] sm:text-4xl">
              Send Us a Message
            </h2>

            <p className="mt-3 text-sm text-[#766C7D] sm:text-base">
              Tell us about your event or business. Our team will get
              back to you soon.
            </p>
          </div>

          {/* Success Message */}
          {submitted && (
            <div className="mb-6 rounded-xl border border-[#BFE3CE] bg-[#F0FFF5] px-5 py-4 text-sm font-medium text-[#217A43]">
              ✓ Thank you! Your message has been sent successfully.
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* =================================================
                NAME + EMAIL
            ================================================== */}
            <div className="grid gap-6 md:grid-cols-2">

              {/* Name */}
              <div>

                <label className="mb-2 block text-sm font-bold text-[#3B2944]">
                  Your Name{" "}
                  <span className="text-[#E98BB5]">*</span>
                </label>

                <div className="relative">

                  <User
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7C3AED]"
                  />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-[#EBDCE5] bg-[#FFF9F2] py-4 pl-12 pr-4 text-sm text-[#2D2433] outline-none transition-all placeholder:text-[#A99DA8] focus:border-[#A855F7] focus:bg-white focus:ring-4 focus:ring-[#F3E8FF]"
                  />
                </div>
              </div>

              {/* Email */}
              <div>

                <label className="mb-2 block text-sm font-bold text-[#3B2944]">
                  Your Email{" "}
                  <span className="text-[#E98BB5]">*</span>
                </label>

                <div className="relative">

                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7C3AED]"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    className="w-full rounded-xl border border-[#EBDCE5] bg-[#FFF9F2] py-4 pl-12 pr-4 text-sm text-[#2D2433] outline-none transition-all placeholder:text-[#A99DA8] focus:border-[#A855F7] focus:bg-white focus:ring-4 focus:ring-[#F3E8FF]"
                  />
                </div>
              </div>
            </div>

            {/* =================================================
                PHONE + BUSINESS
            ================================================== */}
            <div className="grid gap-6 md:grid-cols-2">

              {/* Phone */}
              <div>

                <label className="mb-2 block text-sm font-bold text-[#3B2944]">
                  Phone Number
                </label>

                <div className="relative">

                  <Phone
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7C3AED]"
                  />

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full rounded-xl border border-[#EBDCE5] bg-[#FFF9F2] py-4 pl-12 pr-4 text-sm text-[#2D2433] outline-none transition-all placeholder:text-[#A99DA8] focus:border-[#A855F7] focus:bg-white focus:ring-4 focus:ring-[#F3E8FF]"
                  />
                </div>
              </div>

              {/* Business */}
              <div>

                <label className="mb-2 block text-sm font-bold text-[#3B2944]">
                  Business / Event Name
                </label>

                <input
                  type="text"
                  name="business"
                  value={formData.business}
                  onChange={handleChange}
                  placeholder="Enter business or event name"
                  className="w-full rounded-xl border border-[#EBDCE5] bg-[#FFF9F2] px-4 py-4 text-sm text-[#2D2433] outline-none transition-all placeholder:text-[#A99DA8] focus:border-[#A855F7] focus:bg-white focus:ring-4 focus:ring-[#F3E8FF]"
                />
              </div>
            </div>

            {/* =================================================
                SERVICE DROPDOWN
            ================================================== */}
            <div>

              <label className="mb-2 block text-sm font-bold text-[#3B2944]">
                What are you looking for?
              </label>

              <div className="relative">

                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-xl border border-[#EBDCE5] bg-[#FFF9F2] px-4 py-4 text-sm text-[#2D2433] outline-none transition-all focus:border-[#A855F7] focus:bg-white focus:ring-4 focus:ring-[#F3E8FF]"
                >
                  <option value="">
                    Select a service
                  </option>

                  <option value="Digital Photo Booth">
                    Digital Photo Booth
                  </option>

                  <option value="Custom Photo Templates">
                    Custom Photo Templates
                  </option>

                  <option value="Photo & Video Templates">
                    Photo & Video Templates
                  </option>

                  <option value="Business Branding">
                    Business Branding
                  </option>

                  <option value="AI-Powered Designs">
                    AI-Powered Designs
                  </option>

                  <option value="QR Code Access">
                    QR Code Access
                  </option>

                  <option value="Event Experience">
                    Event Experience
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>

                <ChevronDown
                  size={19}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#7C3AED]"
                />
              </div>
            </div>

            {/* =================================================
                MESSAGE
            ================================================== */}
            <div>

              <label className="mb-2 block text-sm font-bold text-[#3B2944]">
                Your Message{" "}
                <span className="text-[#E98BB5]">*</span>
              </label>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Tell us about your event, business, or requirements..."
                className="w-full resize-none rounded-xl border border-[#EBDCE5] bg-[#FFF9F2] px-4 py-4 text-sm text-[#2D2433] outline-none transition-all placeholder:text-[#A99DA8] focus:border-[#A855F7] focus:bg-white focus:ring-4 focus:ring-[#F3E8FF]"
              />
            </div>

            {/* =================================================
                SEND BUTTON
            ================================================== */}
            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#E98BB5] px-6 py-4 text-base font-bold text-white shadow-lg shadow-[#E8CFE0] transition-all duration-300 hover:-translate-y-1 hover:from-[#6D28D9] hover:to-[#DB6FA3] hover:shadow-xl hover:shadow-[#E5BFD1] active:translate-y-0"
            >
              <Send
                size={19}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />

              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* =====================================================
          BOTTOM BRAND TAGLINE
      ====================================================== */}
      <div className="mx-auto mt-14 flex flex-wrap items-center justify-center gap-3 text-sm font-medium text-[#7C3AED]">

        <span className="h-px w-12 bg-[#E8CFE0]" />

        <Camera size={17} />

        <span>
          Capture • Customize • Celebrate
        </span>

        <span className="h-px w-12 bg-[#E8CFE0]" />
      </div>

    </main>
  );
};

export default Contact;
