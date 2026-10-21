import { Routes, Route } from "react-router-dom";
import Home from "./components/home/Home";
import Pricing from "./components/pricing/Pricing";
import Gallery from "./components/gallery/Gallery";
import Contact from "./components/Contactus/contactus";
import Demo from "./components/Demo/demo";
import AIPrompts from "./components/home/AIPrompt/AIPrompts";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/ai-prompts" element={<AIPrompts />} />
    </Routes>
  );
}
