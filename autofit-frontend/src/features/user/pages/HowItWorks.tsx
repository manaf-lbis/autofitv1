import { AssuranceGrid } from "../components/howItWorks/AssuranceGrid"
import { HowFAQ } from "../components/howItWorks/HowFAQs"
import { HowHero } from "../components/howItWorks/HowHero" 
import { HowSteps } from "../components/howItWorks/HowSteps" 
import { ServiceModes } from "../components/howItWorks/ServiceModes"

export default function HowItWorksPage() {
  return (
    <main className="min-h-svh bg-white mt-10">
      <HowHero />
      <section className="mx-auto w-full max-w-5xl px-4 py-10 md:py-14">
        <HowSteps />
      </section>
      <section className="mx-auto w-full max-w-5xl px-4 pb-14 md:pb-20">
        <ServiceModes />
      </section>
      <section className="mx-auto w-full max-w-5xl px-4 pb-10 md:pb-14">
        <AssuranceGrid />
      </section>
      <section className="mx-auto w-full max-w-5xl px-4 pb-16 md:pb-24">
        <HowFAQ />
      </section>
    </main>
  )
}



