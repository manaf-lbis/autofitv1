export function AssuranceGrid() {
  const items = [
    {
      title: "Verified Mechanics",
      desc: "Background‑checked professionals with real customer ratings.",
      tone: "ring-violet-600/15",
    },
    {
      title: "Real‑Time Tracking",
      desc: "Know when help arrives with status updates and live ETAs.",
      tone: "ring-blue-600/15",
    },
    {
      title: "Up‑Front Pricing",
      desc: "No hidden fees. Clear estimates before you confirm.",
      tone: "ring-teal-600/15",
    },
    {
      title: "Secure Payments",
      desc: "Pay safely in the app—cards and UPI supported.",
      tone: "ring-violet-600/15",
    },
    {
      title: "Anytime Support",
      desc: "24/7 human support for emergencies and quick questions.",
      tone: "ring-blue-600/15",
    },
    {
      title: "Your Data, Protected",
      desc: "We collect only what’s needed and keep it safe.",
      tone: "ring-teal-600/15",
    },
  ] as const

  return (
    <section aria-labelledby="assurance-heading">
      <h2 id="assurance-heading" className="text-pretty text-2xl font-bold md:text-3xl">
        Built for Trust. Tuned for Speed.
      </h2>
      <p className="mt-2 max-w-2xl text-sm md:text-base text-slate-900/80">
        Everything is designed to reduce stress in urgent moments while keeping you in control.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
        {items.map((i, idx) => (
          <article key={idx} className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ${i.tone}`}>
            <h3 className="text-sm font-semibold">{i.title}</h3>
            <p className="mt-1 text-sm text-slate-900/80">{i.desc}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
