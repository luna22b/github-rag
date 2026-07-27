import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, RefreshCcw, Github } from "lucide-react";
import { useState } from "react";

import {
  getRepositories,
  syncRepositories,
  importRepository,
} from "@/api/repositories";

export const Route = createFileRoute("/_protected/repositories/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = Route.useRouteContext();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const githubConnected = Boolean(user.github_username);

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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["repositories"],
      });
    },
    onError: (error) => {
      console.error("SYNC FAILED:", error);
    },
  });

  async function handleRepositoryClick(repositoryId: number) {
    try {
      await importRepository(repositoryId);

      navigate({
        to: "/repositories/$repositoryId/chat",
        params: {
          repositoryId: String(repositoryId),
        },
      });
    } catch (error) {
      console.error("IMPORT FAILED:", error);
    }
  }

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
    <div className="min-h-screen bg-zinc-950 px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div>
          <h1 className="text-2xl font-semibold">Repositories</h1>

          <p className="mt-2 text-sm text-zinc-400">
            Select a repository to explore and chat with your codebase.
          </p>
        </div>

        {!githubConnected ? (
          <div
            className="
              mt-8
              flex h-64
              items-center justify-center
              rounded-xl
              border border-dashed border-zinc-800
              bg-zinc-900/30
            "
          >
            <div className="text-center">
              <Github size={32} className="mx-auto text-zinc-600" />

              <p className="mt-3 text-sm text-zinc-300">
                GitHub is disconnected
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Reconnect GitHub to sync your repositories.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div
                className="
                  flex w-full items-center gap-3
                  rounded-lg
                  border border-zinc-800
                  bg-zinc-900/60
                  px-4 py-2.5
                  lg:max-w-2xl
                "
              >
                <Search size={17} className="text-zinc-500" />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search repositories..."
                  className="
                    w-full
                    bg-transparent
                    text-sm
                    outline-none
                    placeholder:text-zinc-600
                  "
                />
              </div>

              <button
                onClick={() => syncMutation.mutate()}
                disabled={syncMutation.isPending}
                className="
                  flex items-center justify-center gap-2
                  rounded-lg
                  border border-zinc-800
                  bg-zinc-900/60
                  px-4 py-2.5
                  text-sm
                  text-zinc-300
                  transition
                  hover:bg-zinc-800
                  hover:text-white
                  disabled:cursor-not-allowed
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

            <div className="mt-6 flex gap-2">
              {["All", "Public", "Private"].map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`
                    rounded-lg
                    px-4 py-2
                    text-sm
                    transition
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

            <div className="mt-6 text-sm text-zinc-500">
              {repositories.length} repositories connected
            </div>

            {isLoading && (
              <p className="mt-6 text-sm text-zinc-400">
                Loading repositories...
              </p>
            )}

            {error && (
              <p className="mt-6 text-sm text-red-400">
                Failed to load repositories.
              </p>
            )}

            {!isLoading && filteredRepositories.length > 0 && (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredRepositories.map((repo: any) => (
                  <div
                    key={repo.id}
                    onClick={() => handleRepositoryClick(repo.id)}
                    className="
                      group
                      cursor-pointer
                      rounded-xl
                      border border-zinc-800
                      bg-zinc-900/40
                      p-5
                      transition
                      hover:border-zinc-700
                      hover:bg-zinc-900
                    "
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-zinc-800 p-2">
                          <Github size={17} />
                        </div>

                        <h2 className="font-medium">{repo.name}</h2>
                      </div>

                      <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">
                        {repo.private ? "Private" : "Public"}
                      </span>
                    </div>

                    <p className="mt-4 line-clamp-2 text-sm text-zinc-400">
                      {repo.description ?? "No description provided"}
                    </p>

                    <div className="mt-5 text-xs text-zinc-500 transition group-hover:text-zinc-300">
                      Open repository →
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isLoading && filteredRepositories.length === 0 && (
              <div
                className="
                  mt-6
                  flex h-64
                  items-center justify-center
                  rounded-xl
                  border border-dashed border-zinc-800
                  bg-zinc-900/30
                "
              >
                <div className="text-center">
                  <Github size={32} className="mx-auto text-zinc-600" />

                  <p className="mt-3 text-sm text-zinc-300">
                    No repositories found
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Sync your GitHub account to import repositories.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
