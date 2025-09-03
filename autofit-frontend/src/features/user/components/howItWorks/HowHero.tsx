export function HowHero() {
  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-5xl px-4 pt-10 pb-6 md:pt-14 md:pb-8">
        {/* title */}
        <h1 className="text-pretty text-3xl font-extrabold tracking-tight md:text-5xl">
          How <span className="text-violet-700">Mechanic Bookik</span> Works
        </h1>

        {/* subtitle */}
        <p className="mt-3 max-w-2xl text-balance text-sm md:text-base text-slate-900/80">
          One simple flow across three service modes. Start preventive, switch to reactive or supportive instantly— your
          request and details follow you.
        </p>

        {/* meta info bar */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-800">
            <span className="h-2 w-2 rounded-full bg-blue-600" aria-hidden /> Avg response: 7 min
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-800">
            <span className="h-2 w-2 rounded-full bg-teal-600" aria-hidden /> Coverage: 200+ cities
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-800">
            <span className="h-2 w-2 rounded-full bg-violet-600" aria-hidden /> 24/7 human support
          </span>
        </div>

        {/* mode chips */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-violet-600/10 px-3 py-1 text-xs font-medium text-violet-700">
            <span className="h-2 w-2 rounded-full bg-violet-600" aria-hidden />
            Preventive
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-600/10 px-3 py-1 text-xs font-medium text-blue-700">
            <span className="h-2 w-2 rounded-full bg-blue-600" aria-hidden />
            Reactive
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-teal-600/10 px-3 py-1 text-xs font-medium text-teal-700">
            <span className="h-2 w-2 rounded-full bg-teal-600" aria-hidden />
            Supportive
          </span>
        </div>
      </div>
    </section>
  )
}
