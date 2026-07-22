import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { Github, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_protected/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useRouteContext({
    from: "/_protected",
  });

  const githubConnected = Boolean(user.github_username);

  return (
    <div className="min-h-screen bg-zinc-950 px-8 py-8 text-white">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>

        <p className="mt-1 text-sm text-zinc-400">
          Manage your profile, integrations, and preferences.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h2 className="text-lg font-medium">Profile</h2>

          <p className="mt-1 text-sm text-zinc-500">
            This information is shown in your dashboard.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-zinc-400">Username</label>

              <input
                value={user.username}
                readOnly
                className="
                  mt-2 w-full rounded-lg
                  border border-zinc-800
                  bg-zinc-950 px-3 py-2
                  text-sm text-white
                  outline-none
                "
              />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h2 className="text-lg font-medium">Connected GitHub account</h2>

          <p className="mt-1 text-sm text-zinc-500">
            MD reads only the repositories you authorize.
          </p>

          <div
            className="
              mt-6 flex items-center justify-between
              rounded-lg border border-zinc-800
              bg-zinc-950 p-4
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-full bg-zinc-800
                "
              >
                <Github size={20} />
              </div>

              <div>
                <p className="text-sm font-medium">
                  {githubConnected ? user.github_username : "GitHub account"}
                </p>

                <p className="text-xs text-zinc-500">
                  {githubConnected
                    ? `@${user.github_username}`
                    : "No account connected"}
                </p>
              </div>
            </div>

            <span
              className={`
                rounded-full px-3 py-1 text-xs
                ${
                  githubConnected
                    ? "bg-[oklch(0.62_0.19_255)]/15 text-[oklch(0.62_0.19_255)]"
                    : "bg-zinc-800 text-zinc-400"
                }
              `}
            >
              {githubConnected ? "Connected" : "Not connected"}
            </span>
          </div>

          <button
            className="
              mt-4 cursor-pointer
              rounded-lg border border-zinc-800
              px-4 py-2
              text-sm text-zinc-300
              transition hover:bg-zinc-900
            "
          >
            {githubConnected ? "Disconnect GitHub" : "Connect GitHub"}
          </button>
        </section>

        <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h2 className="text-lg font-medium">Appearance</h2>

          <p className="mt-1 text-sm text-zinc-500">
            MD is optimized for dark environments.
          </p>

          <div className="mt-5 flex gap-3">
            {["Dark", "System"].map((item, index) => (
              <button
                key={item}
                className={`
                  cursor-pointer rounded-lg px-5 py-2
                  text-sm transition
                  ${
                    index === 0
                      ? "bg-[oklch(0.62_0.19_255)]/15 text-white"
                      : "border border-zinc-800 text-zinc-400 hover:text-white"
                  }
                `}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-red-900/40 bg-red-950/10 p-6">
          <h2 className="text-lg font-medium text-red-400">Danger zone</h2>

          <p className="mt-1 text-sm text-zinc-500">Irreversible actions.</p>

          <button
            className="
              mt-5 flex cursor-pointer items-center gap-2
              rounded-lg border border-red-900/50
              px-4 py-2
              text-sm text-red-400
              transition hover:bg-red-950/30
            "
          >
            <Trash2 size={16} />
            Delete account
          </button>
        </section>
      </div>
    </div>
  );
}
