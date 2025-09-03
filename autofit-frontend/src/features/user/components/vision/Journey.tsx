const steps = [
  {
    label: "Preventive",
    title: "Start ready",
    desc: "Book a pre‑trip checkup. Get a clear readiness score and a simple list of fixes—before you hit the road.",
    color: "from-purple-600 to-indigo-600",
  },
  {
    label: "Reactive",
    title: "Stay safe",
    desc: "If the unexpected happens, tap roadside help. We dispatch support fast and keep you updated live.",
    color: "from-blue-600 to-indigo-600",
  },
  {
    label: "Supportive",
    title: "Solve smart",
    desc: "Connect with an expert for remote guidance. Quick wins, lower costs, and learning you can reuse.",
    color: "from-teal-600 to-blue-600",
  },
]

export function Journey() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-14 md:py-16 bg-white">
      <header className="mb-8 md:mb-12">
        <h2 className="text-balance text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          A simple journey to peace of mind
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
          Wherever you are in the drive, our system meets you there—so small issues stay small, and big ones get
          handled.
        </p>
      </header>

      <ol className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <li key={i} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div
              className={`inline-flex items-center rounded-full bg-gradient-to-r ${s.color} px-3 py-1 text-xs font-semibold text-white`}
            >
              {i + 1}. {s.label}
            </div>
            <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-900">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.desc}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
