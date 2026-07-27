import { Github, Database, MessageSquare } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Github size={22} />,
      title: "Connect GitHub",
      description:
        "Sign in with GitHub and import public or private repositories with a single click.",
    },
    {
      icon: <Database size={22} />,
      title: "Index Your Code",
      description:
        "Source files are processed, chunked, and indexed for fast semantic search.",
    },
    {
      icon: <MessageSquare size={22} />,
      title: "Ask Questions",
      description:
        "Chat naturally with your repository to understand code, architecture, and implementation details.",
    },
  ];

  return (
    <section className="mx-auto mt-60 max-w-6xl px-6">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[oklch(0.62_0.19_255)]">
          How It Works
        </p>

        <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
          Go from repository to answers in seconds.
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-[oklch(0.56_0.008_285)]">
          Import your repository once, then ask questions in plain English to
          quickly understand unfamiliar codebases.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {steps.map((step) => (
          <div
            key={step.title}
            className="rounded-xl border border-[oklch(0.27_0.005_285)] bg-white/5 p-6"
          >
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-[oklch(0.62_0.19_255)]/15 text-[oklch(0.62_0.19_255)]">
              {step.icon}
            </div>

            <h3 className="text-lg font-semibold text-white">{step.title}</h3>

            <p className="mt-3 text-sm leading-6 text-[oklch(0.56_0.008_285)]">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
