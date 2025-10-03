type Pillar = {
  title: string
  subtitle: string
  description: string
  bullets: string[]
  tone: "purple" | "blue" | "teal"
}

const tones = {
  purple: {
    badge: "bg-purple-50 text-purple-700 ring-purple-200",
    ring: "ring-purple-200",
    button: "bg-purple-600 hover:bg-purple-700 focus-visible:outline-purple-600",
  },
  blue: {
    badge: "bg-blue-50 text-blue-700 ring-blue-200",
    ring: "ring-blue-200",
    button: "bg-blue-600 hover:bg-blue-700 focus-visible:outline-blue-600",
  },
  teal: {
    badge: "bg-teal-50 text-teal-700 ring-teal-200",
    ring: "ring-teal-200",
    button: "bg-teal-600 hover:bg-teal-700 focus-visible:outline-teal-600",
  },
}

const pillars: Pillar[] = [
  {
    title: "Pre‑Trip Checkup",
    subtitle: "Preventive",
    description:
      "Stops problems before they start. We inspect essentials and fine‑tune your vehicle so every trip begins with confidence.",
    bullets: ["Multi‑point health review", "Fluids, tires, lights & safety", "Actionable readiness report"],
    tone: "purple",
  },
  {
    title: "Roadside Assistance",
    subtitle: "Reactive",
    description: "Saves you in emergencies. Fast, reliable help wherever you are—so stress doesn’t stall your day.",
    bullets: ["Rapid response dispatch", "Jumpstart, tire, lockout & tow", "Live status updates"],
    tone: "blue",
  },
  {
    title: "Live Assistance",
    subtitle: "Supportive",
    description: "Immediate low‑cost remote solutions. Talk to an expert who guides you step‑by‑step to a quick fix.",
    bullets: ["Instant video/voice consults", "DIY diagnostics made simple", "Only pay for what you need"],
    tone: "teal",
  },
]

export function Pillars() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12 md:py-16 ">
      <header className="mb-8 md:mb-12">
        <h2 className="text-balance text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          Three pillars that power our vision
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
          Coverage for every moment of car ownership—before trips, during emergencies, and anytime you need expert
          support.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pillars.map((p, i) => (
          <article
            key={i}
            className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ${tones[p.tone].ring}`}
          >
            <div
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ${tones[p.tone].badge}`}
            >
              {p.subtitle}
            </div>
            <h3 className="mt-4 text-xl font-semibold tracking-tight text-slate-900">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.description}</p>

            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              {p.bullets.map((b, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="mt-1 h-2 w-2 flex-none rounded-full bg-slate-300" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6">
             
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
