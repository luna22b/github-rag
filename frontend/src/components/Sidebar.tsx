import { Home, Github, Settings, LogOut, MessageSquare } from "lucide-react";
import { Link, useRouteContext } from "@tanstack/react-router";

const Sidebar = () => {
  const { user } = useRouteContext({
    from: "/_protected",
  });

  const githubConnected = Boolean(user.github_username);

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-zinc-800 bg-zinc-950 px-4 py-6 text-zinc-300">
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[oklch(0.62_0.19_255)] font-bold text-black">
          MD
        </div>

        <div>
          <h1 className="text-sm font-semibold text-white">MD</h1>

          <p className="text-xs text-zinc-500">GitHub Intelligence</p>
        </div>
      </div>

      <nav className="mt-8 space-y-1">
        <SidebarItem
          to="/dashboard"
          icon={<Home size={18} />}
          label="Dashboard"
        />

        <SidebarItem
          to="/repositories"
          icon={<Github size={18} />}
          label="Repositories"
        />

        <SidebarItem
          to="/chat-history"
          icon={<MessageSquare size={18} />}
          label="Chat History"
        />

        <SidebarItem
          to="/settings"
          icon={<Settings size={18} />}
          label="Settings"
        />
      </nav>

      <div className="mt-auto">
        <div className="mb-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
          <p className="text-xs text-zinc-500">Connected as</p>

          <p className="mt-1 text-sm font-medium text-white">{user.username}</p>

          <div className="mt-2 flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                githubConnected ? "bg-[oklch(0.62_0.19_255)]" : "bg-zinc-600"
              }`}
            />

            <span className="text-xs text-zinc-500">
              {githubConnected ? "GitHub connected" : "GitHub not connected"}
            </span>
          </div>
        </div>

        <SidebarItem to="/logout" icon={<LogOut size={18} />} label="Logout" />
      </div>
    </aside>
  );
};

function SidebarItem({
  icon,
  label,
  to,
}: {
  icon: React.ReactNode;
  label: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="
        flex items-center gap-3 rounded-lg px-3 py-2.5
        text-sm text-zinc-400
        transition-all duration-200
        hover:bg-zinc-900 hover:text-white
        [&.active]:bg-[oklch(0.62_0.19_255)]/15
      "
    >
      {({ isActive }) => (
        <>
          <span
            className={
              isActive ? "text-[oklch(0.62_0.19_255)]" : "text-zinc-500"
            }
          >
            {icon}
          </span>

          <span className={isActive ? "text-white" : "text-zinc-400"}>
            {label}
          </span>
        </>
      )}
    </Link>
  );
}

export default Sidebar;
