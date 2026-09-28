import Navbar from "./Navbar";
import Hero from "./Hero";
import FeatureIcons from "./FeatureIcons";
import Templates from "./Templates";
import HowItWorks from "./HowItWorks";
import BusinessBanner from "./BusinessBanner";
import Stats from "./Stats";
import Testimonials from "./Testimonials";
import Footer from "./Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <Navbar />
      <Hero />
      <FeatureIcons />
      <Templates />
      <HowItWorks />
      <BusinessBanner />
      <Stats />
      <Testimonials />
      <Footer />
    </div>
  );
}
