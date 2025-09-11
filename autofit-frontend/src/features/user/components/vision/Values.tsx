const values = [
  {
    title: "Trust & Transparency",
    desc: "Clear pricing, honest advice, and step‑by‑step guidance so you always understand what’s happening—and why.",
  },
  {
    title: "Speed with Care",
    desc: "Rapid responses without cutting corners. We prioritize your safety and time, in that order.",
  },
  {
    title: "Expertise for Everyone",
    desc: "Certified expertise delivered in plain language—meeting you on the road or at home.",
  },
  {
    title: "Fair & Flexible",
    desc: "Only pay for what you need: preventive checks, on‑the‑spot help, or remote guidance that saves you money.",
  },
]

export function Values() {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-14 md:py-16">
        <header className="mb-8 md:mb-12">
          <h2 className="text-balance text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            The values behind the wheel
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
            Our principles guide every interaction—from the first ping to a fully resolved issue—so you always feel
            supported.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-base font-semibold tracking-tight text-slate-900">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
