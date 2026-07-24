import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, RefreshCcw, Plus, Github } from "lucide-react";
import { useState } from "react";

import {
  getRepositories,
  syncRepositories,
  importRepository,
} from "@/api/repositories";

export const Route = createFileRoute("/_protected/repositories")({
  component: RouteComponent,
});

function RouteComponent() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const queryClient = useQueryClient();

  const {
    data: repositories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["repositories"],
    queryFn: getRepositories,
  });

  const syncMutation = useMutation({
    mutationFn: syncRepositories,
    onSuccess: (data) => {
      console.log("SYNC SUCCESS:", data);

      queryClient.invalidateQueries({
        queryKey: ["repositories"],
      });
    },
    onError: (error) => {
      console.error("SYNC FAILED:", error);
    },
  });

  const filteredRepositories = repositories.filter((repo: any) => {
    const matchesSearch = repo.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ||
      (filter === "Private" && repo.private) ||
      (filter === "Public" && !repo.private);

    return matchesSearch && matchesFilter;
  });

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
          onClick={() => syncMutation.mutate()}
          disabled={syncMutation.isPending}
          className="
            flex cursor-pointer items-center gap-2
            rounded-lg bg-[oklch(0.62_0.19_255)]
            px-4 py-2 text-sm font-medium text-black
            transition hover:opacity-90
            disabled:opacity-50
          "
        >
          <RefreshCcw
            size={16}
            className={syncMutation.isPending ? "animate-spin" : ""}
          />

          {syncMutation.isPending ? "Syncing..." : "Sync repositories"}
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
        {["All", "Public", "Private"].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`
              cursor-pointer rounded-lg px-4 py-2 text-sm transition
              ${
                filter === item
                  ? "bg-[oklch(0.62_0.19_255)]/15 text-white"
                  : "text-zinc-400 hover:text-white"
              }
            `}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-8 text-sm text-zinc-500">
        {repositories.length} repositories connected
      </div>

      {isLoading && (
        <div className="mt-6 text-sm text-zinc-400">
          Loading repositories...
        </div>
      )}

      {error && (
        <div className="mt-6 text-sm text-red-400">
          Failed to load repositories.
        </div>
      )}

      {!isLoading && filteredRepositories.length > 0 && (
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredRepositories.map((repo: any) => (
            <div
              key={repo.id}
              className="
                  rounded-xl border border-zinc-800
                  bg-zinc-900/50 p-5
                  transition hover:border-zinc-700
                "
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Github size={18} />

                  <h2 className="font-medium">{repo.name}</h2>
                </div>

                <span className="text-xs text-zinc-500">
                  {repo.private ? "Private" : "Public"}
                </span>
              </div>

              <p className="mt-3 line-clamp-2 text-sm text-zinc-400">
                {repo.description ?? "No description"}
              </p>

              <button
                onClick={() => importRepository(repo.id)}
                className="
                    mt-5 w-full rounded-lg
                    bg-zinc-800 py-2
                    text-sm text-zinc-200
                    transition hover:bg-zinc-700
                  "
              >
                Import repository
              </button>
            </div>
          ))}
        </div>
      )}

      {!isLoading && filteredRepositories.length === 0 && (
        <div
          className="
              mt-6 flex h-64 items-center justify-center
              rounded-xl border border-dashed border-zinc-800
              bg-zinc-900/30
            "
        >
          <div className="text-center">
            <Github size={32} className="mx-auto text-zinc-600" />

            <p className="mt-3 text-sm text-zinc-300">No repositories found</p>

            <p className="mt-1 text-xs text-zinc-500">
              Sync your GitHub account to import repositories.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
