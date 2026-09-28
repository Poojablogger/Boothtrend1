import Navbar from "../home/Navbar";
import Footer from "../home/Footer";
import PricingCards from "./PricingCards";
import CTABanner from "./CTABanner";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <Navbar />
      <PricingCards />
      <CTABanner />
      <Footer />
    </div>
  );
}
