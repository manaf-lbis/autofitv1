export function CTA() {
  return (
    <section className="relative bg-white">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white to-slate-50" />
      <div className="mx-auto max-w-5xl px-6 py-14 md:py-16">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <h2 className="text-balance text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Ready for{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              worry‑free
            </span>{" "}
            driving?
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
            Join drivers who trust Mechanic Bookik for preventive checks, emergency help, and live expert guidance—all
            in one place.
          </p>
        </div>
      </div>
    </section>
  )
}
