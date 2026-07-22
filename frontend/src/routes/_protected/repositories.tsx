import { createFileRoute } from "@tanstack/react-router";
import { Search, RefreshCcw, Plus } from "lucide-react";

export const Route = createFileRoute("/_protected/repositories")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen bg-zinc-950 px-8 py-8 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Repositories</h1>

          <p className="mt-1 text-sm text-zinc-400">
            Choose a repository to import
          </p>
        </div>

        <button
          className="
            flex cursor-pointer items-center gap-2
            rounded-lg bg-[oklch(0.62_0.19_255)]
            px-4 py-2 text-sm font-medium text-black
            transition hover:opacity-90
          "
        >
          <RefreshCcw size={16} />
          Sync repositories
        </button>
      </div>

      <p className="mt-3 max-w-xl text-sm text-zinc-500">
        Search and filter your GitHub repositories. Click one to start indexing.
      </p>

      <div className="mt-8 flex items-center justify-between">
        <div
          className="
            flex w-96 items-center gap-3
            rounded-lg border border-zinc-800
            bg-zinc-900 px-4 py-2
          "
        >
          <Search size={17} className="text-zinc-500" />

          <input
            placeholder="Search repositories..."
            className="
              w-full bg-transparent
              text-sm text-white
              outline-none
              placeholder:text-zinc-600
            "
          />
        </div>

        <button
          className="
            flex cursor-pointer items-center gap-2
            rounded-lg border border-zinc-800
            bg-zinc-900 px-4 py-2
            text-sm text-zinc-300
            transition hover:bg-zinc-800
          "
        >
          <Plus size={16} />
          Add source
        </button>
      </div>

      <div className="mt-6 flex gap-2">
        {["All", "Public", "Private"].map((filter, index) => (
          <button
            key={filter}
            className={`
              cursor-pointer rounded-lg px-4 py-2 text-sm transition
              ${
                index === 0
                  ? "bg-[oklch(0.62_0.19_255)]/15 text-white"
                  : "text-zinc-400 hover:text-white"
              }
            `}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="mt-8 text-sm text-zinc-500">0 repositories connected</div>

      <div
        className="
          mt-4 flex h-64 items-center justify-center
          rounded-xl border border-dashed border-zinc-800
          bg-zinc-900/30
        "
      >
        <div className="text-center">
          <p className="text-sm text-zinc-300">No repositories connected</p>

          <p className="mt-1 text-xs text-zinc-500">
            Sync your GitHub account to import repositories.
          </p>
        </div>
      </div>
    </div>
  );
}
