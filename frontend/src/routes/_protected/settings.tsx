import { createFileRoute } from "@tanstack/react-router";
import { Github } from "lucide-react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

import { useCurrentUser } from "@/hooks/useCurrentUser";

export const Route = createFileRoute("/_protected/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return null;
  }

  const githubConnected = Boolean(user?.github_username);

  async function handleGithubAction() {
    if (githubConnected) {
      try {
        await axios.delete("http://localhost:8000/api/auth/github/disconnect", {
          withCredentials: true,
        });

        await queryClient.invalidateQueries({
          queryKey: ["currentUser"],
        });
      } catch (error) {
        console.error("Failed to disconnect GitHub:", error);
      }

      return;
    }

    window.location.href = "http://localhost:8000/api/auth/github/login";
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-8 text-white sm:px-6">
      <div className="mx-auto flex max-w-7xl justify-center">
        <div className="w-full max-w-3xl">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Settings</h1>

            <p className="mt-1 text-sm text-zinc-400">
              Manage your integrations and preferences.
            </p>
          </div>

          <div className="mt-8">
            <GithubSection
              username={user?.github_username}
              connected={githubConnected}
              onAction={handleGithubAction}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function GithubSection({
  username,
  connected,
  onAction,
}: {
  username?: string;
  connected: boolean;
  onAction: () => void;
}) {
  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6">
      <h2 className="text-lg font-medium">Connected GitHub account</h2>

      <p className="mt-1 text-sm text-zinc-500">
        MD reads only the repositories you authorize.
      </p>

      <div className="mt-6 flex flex-col gap-4 rounded-lg border border-zinc-800 bg-zinc-950 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800">
            <Github size={20} />
          </div>

          <div>
            <p className="text-sm font-medium">
              {connected ? username : "GitHub account"}
            </p>

            <p className="text-xs text-zinc-500">
              {connected ? `@${username}` : "No account connected"}
            </p>
          </div>
        </div>

        <span
          className={`w-fit rounded-full px-3 py-1 text-xs ${
            connected
              ? "bg-blue-500/15 text-blue-400"
              : "bg-zinc-800 text-zinc-400"
          }`}
        >
          {connected ? "Connected" : "Not connected"}
        </span>
      </div>

      <button
        onClick={onAction}
        className="
          mt-4
          cursor-pointer
          rounded-lg
          border border-zinc-800
          bg-zinc-900/60
          px-4 py-2
          text-sm
          text-zinc-300
          transition
          hover:bg-zinc-800
          hover:text-white
        "
      >
        {connected ? "Disconnect GitHub" : "Connect GitHub"}
      </button>
    </section>
  );
}
