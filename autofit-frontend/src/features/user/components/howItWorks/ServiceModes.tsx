"use client"

import type React from "react"

import { useState, useCallback, useMemo } from "react"
import { cn } from "@/lib/utils"

type Mode = {
  key: "preventive" | "reactive" | "supportive"
  title: string
  punch: string
  color: "violet" | "blue" | "teal"
  points: string[]
}

const modes: Mode[] = [
  {
    key: "preventive",
    title: "Preventive (Pre‑Trip Checkup)",
    punch: "Stops problems before they start.",
    color: "violet",
    points: [
      "Quick digital checklist tailored to your car",
      "Pro tips to avoid roadside surprises",
      "Book a visit if anything needs attention",
    ],
  },
  {
    key: "reactive",
    title: "Reactive (Roadside Assistance)",
    punch: "Saves you in emergencies.",
    color: "blue",
    points: [
      "One‑tap request with live status updates",
      "Trusted mechanics dispatched to your location",
      "Clear pricing and secure payment",
    ],
  },
  {
    key: "supportive",
    title: "Supportive (Live Assistance)",
    punch: "Immediate, low‑cost solutions remotely.",
    color: "teal",
    points: [
      "Live call or chat with certified experts",
      "Step‑by‑step guidance to get you moving",
      "Only pay for the time you need",
    ],
  },
]

const chipBg: Record<Mode["color"], string> = {
  violet: "bg-violet-600",
  blue: "bg-blue-600",
  teal: "bg-teal-600",
}

const ringTone: Record<Mode["color"], string> = {
  violet: "ring-violet-600/15",
  blue: "ring-blue-600/15",
  teal: "ring-teal-600/15",
}

const labelTone: Record<Mode["color"], string> = {
  violet: "text-violet-700",
  blue: "text-blue-700",
  teal: "text-teal-700",
}

export function ServiceModes() {
  const [active, setActive] = useState<Mode["key"]>("preventive")
  const current = useMemo(() => modes.find((m) => m.key === active)!, [active])

  const order: Mode["key"][] = ["preventive", "reactive", "supportive"]
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const idx = order.indexOf(active)
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault()
        setActive(order[(idx + 1) % order.length])
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault()
        setActive(order[(idx - 1 + order.length) % order.length])
      }
    },
    [active],
  )

  return (
    <div>
      <h2 className="text-pretty text-2xl font-bold md:text-3xl">Three Ways We Help—When You Need It</h2>
      <p className="mt-2 max-w-2xl text-sm md:text-base text-slate-900/80">
        Choose the mode that fits your situation. Switch anytime—your request follows you.
      </p>

      {/* segmented control */}
      <div
        role="tablist"
        aria-label="Service modes"
        className="mt-6 inline-flex w-full max-w-xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
        onKeyDown={onKeyDown}
        tabIndex={0}
      >
        {modes.map((m) => {
          const isActive = active === m.key
          return (
            <button
              key={m.key}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${m.key}`}
              onClick={() => setActive(m.key)}
              className={cn(
                "flex-1 px-4 py-2 text-sm font-medium transition",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-300",
                isActive ? "bg-slate-50" : "hover:bg-slate-50/60",
              )}
            >
              <span className="inline-flex items-center gap-2">
                <span className={cn("h-2.5 w-2.5 rounded-full", chipBg[m.color])} aria-hidden />
                <span className={cn("hidden sm:inline", labelTone[m.color])}>{m.title.split(" ")[0]}</span>
                <span className="sm:hidden">{m.title.split(" ")[0]}</span>
              </span>
            </button>
          )
        })}
      </div>

      {/* active panel */}
      <article
        id={`panel-${current.key}`}
        role="tabpanel"
        aria-labelledby={current.key}
        className={cn(
          "mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ring-1",
          ringTone[current.color],
        )}
      >
        <div className="flex items-center gap-3">
          <span className={cn("inline-block h-8 w-8 rounded-xl", chipBg[current.color])} aria-hidden />
          <h3 className="text-base md:text-lg font-semibold">{current.title}</h3>
        </div>
        <p className="mt-2 text-sm font-medium">{current.punch}</p>

        {/* spec chips */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-800">
            <span className="h-2 w-2 rounded-full bg-blue-600" aria-hidden /> ETA: as fast as 7–20 min
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-800">
            <span className="h-2 w-2 rounded-full bg-teal-600" aria-hidden /> Availability: 24/7
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-800">
            <span className="h-2 w-2 rounded-full bg-violet-600" aria-hidden /> Transparent pricing
          </span>
        </div>

        <ul className="mt-3 list-disc pl-5 space-y-2">
          {current.points.map((pt, i) => (
            <li key={i} className="text-sm text-slate-900/80">
              {pt}
            </li>
          ))}
        </ul>
      </article>

      {/* secondary glance cards for desktop to provide quick comparison */}
      <div className="mt-6 hidden md:grid grid-cols-3 gap-4">
        {modes.map((m) => (
          <button
            key={m.key}
            onClick={() => setActive(m.key)}
            className={cn(
              "text-left rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition",
              "hover:-translate-y-0.5 hover:shadow-md",
              "ring-1",
              ringTone[m.color],
              active === m.key ? "outline outline-2 outline-offset-2 outline-slate-200" : "",
            )}
            aria-label={`Show ${m.title}`}
          >
            <div className="flex items-center gap-3">
              <span className={cn("inline-block h-6 w-6 rounded-lg", chipBg[m.color])} aria-hidden />
              <div className="font-semibold text-sm">{m.title}</div>
            </div>
            <p className="mt-1 text-xs text-slate-900/75">{m.punch}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
