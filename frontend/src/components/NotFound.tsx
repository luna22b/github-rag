export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-zinc-950 px-6 pb-20 text-white">
      <div className="text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-900/60">
          <span className="text-4xl">🌙</span>
        </div>

        <h1 className="mt-8 text-6xl font-bold tracking-tight">404</h1>

        <h2 className="mt-4 text-xl font-medium">Lost in the void?</h2>

        <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-400">
          Looks like this page wandered off. The link might be broken or the
          page may have never existed.
        </p>

        <button
          onClick={() => window.history.back()}
          className="
            mt-6
            cursor-pointer
            rounded-lg
            border border-zinc-800
            bg-zinc-900/60
            px-5 py-2.5
            text-sm
            text-zinc-300
            transition
            hover:bg-zinc-800
            hover:text-white
          "
        >
          Go back
        </button>
      </div>
    </div>
  );
}
