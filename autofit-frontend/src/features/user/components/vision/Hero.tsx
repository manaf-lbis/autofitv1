export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Subtle background and grid. No images used. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b " />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-40 [background:linear-gradient(to_right,rgba(148,163,184,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.15)_1px,transparent_1px)] [background-size:24px_24px]"
      />

      <div className="mx-auto max-w-5xl px-6 py-18 md:py-24">
        <p className="mb-3 text-sm font-medium tracking-wide text-slate-500">Autofit — Our Vision</p>
        <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-6xl">
          Professional{" "}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Automotive Services
          </span>
        </h1>
        <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-slate-600 md:text-lg">
          We believe car care should be proactive, human, and always within reach. Our vision is to keep every driver
          moving—smarter, safer, and stress‑free—through three complementary services.
        </p>

        {/* Service chips */}
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 ring-1 ring-purple-200">
            Preventive • Pre‑Trip Checkup
          </span>
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200">
            Reactive • Roadside Assistance
          </span>
          <span className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 ring-1 ring-teal-200">
            Supportive • Live Assistance
          </span>
        </div>
      </div>
    </section>
  )
}
