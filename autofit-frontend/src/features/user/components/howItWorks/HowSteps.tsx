import { cn } from "@/lib/utils"

type Step = {
  id: number
  title: string
  desc: string
  badge: string
  color: "blue" | "teal" | "violet"
}

const steps: Step[] = [
  {
    id: 1,
    title: "Tell Us What You Need",
    desc: "Pick your service and share quick details about your vehicle and situation.",
    badge: "Start",
    color: "blue",
  },
  {
    id: 2,
    title: "Get Matched Instantly",
    desc: "We route your request to the right expert—preventive, reactive, or supportive.",
    badge: "Match",
    color: "teal",
  },
  {
    id: 3,
    title: "Resolve With Confidence",
    desc: "Follow clear steps or get on‑site help. Pay securely and rate your experience.",
    badge: "Resolve",
    color: "violet",
  },
]

const accents: Record<Step["color"], { ring: string; dot: string; label: string; bar: string }> = {
  blue: { ring: "ring-blue-600/20", dot: "bg-blue-600", label: "text-blue-700", bar: "bg-blue-600" },
  teal: { ring: "ring-teal-600/20", dot: "bg-teal-600", label: "text-teal-700", bar: "bg-teal-600" },
  violet: { ring: "ring-violet-600/20", dot: "bg-violet-600", label: "text-violet-700", bar: "bg-violet-600" },
}

export function HowSteps() {
  return (
    <div>
      <h2 className="text-pretty text-2xl font-bold md:text-3xl">3 Steps. Minutes to Complete.</h2>
      <p className="mt-2 max-w-2xl text-sm md:text-base text-slate-900/80">
        Designed for speed on mobile and clarity on desktop—no app required.
      </p>

      {/* segmented rhythm bar */}
      <div className="mt-5 hidden md:grid grid-cols-3 gap-2" aria-hidden>
        {steps.map((s) => (
          <div key={s.id} className={cn("h-1.5 rounded-full", accents[s.color].bar)} />
        ))}
      </div>

      {/* timeline rail for mobile */}
      <div className="mt-5 md:hidden" aria-hidden>
        <div className="h-1.5 w-full rounded-full bg-slate-200" />
      </div>

      <ol className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        {steps.map((s) => {
          const c = accents[s.color]
          return (
            <li
              key={s.id}
              className={cn(
                "group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition",
                "hover:-translate-y-0.5 hover:shadow-md focus-within:shadow-md",
                "ring-1",
                c.ring,
              )}
              aria-label={`Step ${s.id}: ${s.title}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={cn("h-3 w-3 rounded-full", c.dot)} aria-hidden />
                  <span className={cn("text-xs font-medium uppercase tracking-wide", "text-slate-900/70")}>
                    {s.badge}
                  </span>
                </div>
                <span className="text-xs font-semibold text-slate-900/70">
                  Step {s.id} of {steps.length}
                </span>
              </div>

              <h3 className="mt-4 text-base md:text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-900/80">{s.desc}</p>

              {/* progressive disclosure */}
              <details className="mt-3">
                <summary className="cursor-pointer select-none text-xs font-medium text-slate-900/70 hover:text-slate-900">
                  Learn more about this step
                </summary>
                <div className="mt-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-900/75">
                  {s.id === 1 && (
                    <ul className="list-disc space-y-1 pl-5">
                      <li>Describe the issue or choose Pre‑Trip Checkup.</li>
                      <li>Share car basics (make/model/year) and location.</li>
                      <li>We only ask for what’s needed—under 60 seconds.</li>
                    </ul>
                  )}
                  {s.id === 2 && (
                    <ul className="list-disc space-y-1 pl-5">
                      <li>Our system routes to the right expert instantly.</li>
                      <li>See estimated time and live status updates.</li>
                      <li>Switch modes anytime without re‑entering info.</li>
                    </ul>
                  )}
                  {s.id === 3 && (
                    <ul className="list-disc space-y-1 pl-5">
                      <li>Follow clear steps or get a mechanic dispatched.</li>
                      <li>Secure payment. Transparent pricing.</li>
                      <li>Rate your experience to help improve quality.</li>
                    </ul>
                  )}
                </div>
              </details>

              <div className="mt-4 text-xs text-slate-900/60">Estimated time: under 3 minutes</div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
