import Link from "next/link";
import {
  FiUploadCloud,
  FiZap,
  FiDownload,
  FiShield,
  FiLock,
  FiCpu,
  FiLayers,
  FiCheckCircle,
  FiArrowRight,
} from "react-icons/fi";
import Navbar from "@/component/layout/Navbar";
import Reveal from "@/component/ui/Reveal";

const STEPS = [
  {
    icon: FiUploadCloud,
    title: "Drop your file",
    body: "CSV, Excel, JSON, JSONL, TSV or plain text. Any messy dataset — up to thousands of rows.",
    tint: "brand",
  },
  {
    icon: FiZap,
    title: "Describe the cleanup",
    body: "Type what you want in plain English: fix typos, standardize cities, remove emojis, normalize formats.",
    tint: "grass",
  },
  {
    icon: FiDownload,
    title: "Download clean data",
    body: "The AI agent cleans it row-by-row and streams a clean file straight back. Same shape, zero mess.",
    tint: "brand",
  },
];

const FEATURES = [
  {
    icon: FiCpu,
    title: "gpt-oss agent",
    body: "Runs on gpt-oss via Ollama Cloud. Understands your instructions and cleans with real reasoning — not brittle regex.",
  },
  {
    icon: FiLayers,
    title: "Chunked processing",
    body: "Large files are split into row-chunks and cleaned in safe batches, preserving keys, order and row count.",
  },
  {
    icon: FiShield,
    title: "Never loses data",
    body: "If a chunk can't be parsed, the original rows are kept. You never end up with fewer rows than you started with.",
  },
  {
    icon: FiCheckCircle,
    title: "Smart dedup",
    body: "Duplicate and empty rows are stripped automatically after the AI pass — with a full report of what changed.",
  },
  {
    icon: FiZap,
    title: "Prompt-driven",
    body: "No config screens. Your prompt is the whole interface — describe the outcome and let the agent handle it.",
  },
  {
    icon: FiLock,
    title: "Credit-based",
    body: "Transparent pricing — one credit per 10 rows, charged only after a successful clean. No subscriptions to babysit.",
  },
];

const FORMATS = ["CSV", "Excel (.xlsx)", "JSON", "JSONL", "TSV", "TXT / Chat logs"];

const tintClasses: Record<string, string> = {
  brand: "bg-brand-50 text-brand ring-brand-100",
  grass: "bg-grass-50 text-grass ring-grass-100",
};

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <Navbar />

      {/* ---------- HERO ---------- */}
      <section className="relative px-5 pt-32 pb-24 sm:pt-40">
        <div className="grid-bg pointer-events-none absolute inset-0 -z-10" />
        <div className="pointer-events-none absolute -top-24 left-1/4 -z-10 h-72 w-72 rounded-full bg-brand/20 blur-3xl animate-blob" />
        <div className="pointer-events-none absolute top-10 right-1/4 -z-10 h-72 w-72 rounded-full bg-grass/20 blur-3xl animate-blob [animation-delay:3s]" />

        <div className="mx-auto max-w-3xl text-center">
          <div className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-4 py-1.5 text-xs font-medium text-ash backdrop-blur">
            <span className="dot" /> Powered by gpt-oss on Ollama Cloud
          </div>

          <h1 className="animate-fade-up text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-6xl">
            Clean any dataset
            <br />
            with a <span className="text-gradient">single prompt</span>
          </h1>

          <p className="animate-fade-up mx-auto mt-6 max-w-xl text-lg text-ash [animation-delay:120ms]">
            Upload a messy CSV, describe how you want it cleaned, and an AI agent
            hands you back a clean file — row by row. Your data is never stored.
          </p>

          <div className="animate-fade-up mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row [animation-delay:240ms]">
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition-all hover:bg-brand-600 hover:shadow-xl hover:shadow-brand/40"
            >
              Start cleaning free
              <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#how"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-gray-300 hover:bg-gray-50"
            >
              See how it works
            </a>
          </div>

          <p className="animate-fade-up mt-4 text-xs text-ash [animation-delay:320ms]">
            100 free credits on signup · no card required
          </p>
        </div>

        {/* mock chat card */}
        <Reveal className="mx-auto mt-16 max-w-2xl" delay={100}>
          <div className="animate-float rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-2xl shadow-gray-200/60 backdrop-blur">
            <div className="mb-3 flex items-center gap-2 border-b border-gray-100 pb-3">
              <span className="h-3 w-3 rounded-full bg-brand" />
              <span className="h-3 w-3 rounded-full bg-grass" />
              <span className="h-3 w-3 rounded-full bg-gray-200" />
              <span className="ml-2 font-mono text-xs text-ash">
                customers.csv · 1,240 rows
              </span>
            </div>
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-ink px-4 py-2.5 text-sm text-white">
                Fix the city misspellings, normalize country to “USA”, and remove
                emojis from the notes column.
              </div>
            </div>
            <div className="mt-3 flex items-start gap-2.5">
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-grass-50 text-grass">
                <FiCpu size={14} />
              </span>
              <div className="max-w-[80%] rounded-2xl rounded-bl-sm border border-gray-100 bg-gray-50 px-4 py-2.5 text-sm text-ink">
                Done. Cleaned <b>1,240 rows</b> · fixed 3 city spellings ·
                normalized country · removed 41 emojis · dropped 6 duplicates.
                <span className="mt-2 flex items-center gap-1.5 text-xs font-medium text-grass">
                  <FiCheckCircle size={13} /> cleaned_customers.csv ready
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <section id="how" className="border-t border-gray-100 bg-gray-50/60 px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand">
              How it works
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Three steps. No spreadsheets.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 120}>
                <div className="group h-full rounded-2xl border border-gray-200 bg-white p-7 transition-all hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl hover:shadow-gray-200/60">
                  <div
                    className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ring-8 ${tintClasses[s.tint]}`}
                  >
                    <s.icon size={22} />
                  </div>
                  <div className="mb-1 font-mono text-xs text-ash">STEP {i + 1}</div>
                  <h3 className="text-lg font-semibold text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ash">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FEATURES ---------- */}
      <section id="features" className="px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-grass">
              Features
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              A cleaning agent that actually understands your data
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 100}>
                <div className="h-full rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-brand-300 hover:shadow-lg hover:shadow-brand-50">
                  <f.icon className="mb-4 text-brand" size={22} />
                  <h3 className="font-semibold text-ink">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ash">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- PRIVACY ---------- */}
      <section id="privacy" className="px-5 py-16">
        <Reveal className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-3xl bg-ink px-8 py-14 text-center sm:px-16">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-grass/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-brand/20 blur-3xl" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-grass/15 px-4 py-1.5 text-xs font-semibold text-grass-400">
                <FiLock size={13} /> Zero data storage
              </span>
              <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Your data never touches a disk
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-gray-400">
                Every file is processed entirely in memory and streamed straight
                back to you. Nothing is written to disk, saved to a database, or
                uploaded to any cloud storage. When the response ends, it&apos;s gone.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------- FORMATS ---------- */}
      <section id="formats" className="px-5 py-24">
        <div className="mx-auto max-w-6xl text-center">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Works with the formats you already have
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {FORMATS.map((f) => (
                <span
                  key={f}
                  className="rounded-full border border-gray-200 bg-white px-5 py-2.5 font-mono text-sm text-ink transition-colors hover:border-brand hover:text-brand"
                >
                  {f}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="px-5 pb-28">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-5xl">
            Stop wrangling. Start cleaning.
          </h2>
          <p className="mt-4 text-lg text-ash">
            Sign in with Google and clean your first dataset in under a minute.
          </p>
          <Link
            href="/login"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition-all hover:bg-brand-600 hover:shadow-xl hover:shadow-brand/40"
          >
            Launch the app
            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="border-t border-gray-100 px-5 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink text-xs font-bold text-white">
              P2
            </span>
            <span className="text-sm font-semibold">
              Prompt<span className="text-brand">2</span>Data
            </span>
          </div>
          <p className="text-xs text-ash">
            © {new Date().getFullYear()} Prompt2Data · Cleaned in memory, never stored.
          </p>
        </div>
      </footer>
    </main>
  );
}
