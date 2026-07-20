export default function Home() {
  return (
    <div className="mt-30 flex flex-col items-center text-center">
      <h1 className="text-5xl font-extrabold tracking-[-1.2px] md:text-7xl">
        <span className="text-[oklch(0.965_0.002_285)]">
          Understand Any GitHub
        </span>
        <br className="hidden md:block" />
        <span className="text-[oklch(0.965_0.002_285)]"> Repository</span>
        <span className="text-[oklch(0.56_0.008_285)]"> with AI.</span>
      </h1>

      <p className="mx-auto mt-8 max-w-sm text-[oklch(0.56_0.008_285)] md:max-w-xl md:text-lg">
        Connect GitHub, import repositories, and ask questions about any
        codebase. Fast answers powered by semantic search and
        retrieval-augmented generation.
      </p>
    </div>
  );
}
