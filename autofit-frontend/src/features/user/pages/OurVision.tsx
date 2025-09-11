import { Hero } from "../components/vision/Hero" 
import { Pillars } from "../components/vision/Pillars"
import { Values } from "../components/vision/Values" 
import { Journey } from "../components/vision/Journey" 
import { CTA } from "../components/vision/Cta"

export default function VisionPage() {
  return (
    <main className="font-sans bg-white">
      <Hero />
      <Pillars />
      <Values />
      <Journey />
      <CTA />
    </main>
  )
}
