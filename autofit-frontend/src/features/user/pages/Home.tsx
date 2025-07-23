import React from "react";
import { useRef } from "react";
import Hero from "../components/home/Hero";
import Footer from "../components/Footer";
import Testimonials from "../components/home/Testimonials";
import FAQ from "../components/home/FAQ";
import HowItWorks from "../components/home/HowItWorks";
import Service from "../components/home/Service";
import FeatureShowcase from "../components/home/FeatureShowcase";

const Home :React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="bg-white" ref={containerRef}>
      <Hero />
      <Service />

      <FeatureShowcase />

      <HowItWorks />
      <Testimonials />
      <FAQ />

      <Footer />
    </div>
  );
};

export default Home;

