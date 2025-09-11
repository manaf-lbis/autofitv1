export function HowFAQ() {
  const faqs = [
    {
      q: "Can I switch from Live Assistance to Roadside Assistance mid‑request?",
      a: "Yes. Your information carries over so you don’t re‑enter anything. You’ll see updated ETA and pricing before confirming.",
    },
    {
      q: "Do I need to install an app?",
      a: "No. Everything works in the browser. You can optionally save a shortcut to your home screen.",
    },
    {
      q: "How do you select the right mechanic?",
      a: "We factor proximity, specialization, ratings, and availability to route your request to the best‑fit professional.",
    },
    {
      q: "What if I just need quick advice?",
      a: "Choose Supportive (Live Assistance). A certified expert will guide you step‑by‑step to get you moving for a low per‑minute rate.",
    },
  ] as const

  return (
    <section aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-pretty text-2xl font-bold md:text-3xl">
        Common Questions
      </h2>
      <div className="mt-4 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
        {faqs.map((f, idx) => (
          <details key={idx} className="group p-4">
            <summary className="cursor-pointer select-none text-sm font-medium text-slate-900/90 outline-none transition group-open:text-slate-900">
              {f.q}
            </summary>
            <p className="mt-2 text-sm text-slate-900/80">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
