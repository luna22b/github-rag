import { ArrowRight, Github, Settings, LogOut } from "lucide-react";
import { useNavigate, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";

import { logoutUser } from "../api/auth";
import { useCurrentUser } from "../hooks/useCurrentUser";

export default function Navbar() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useCurrentUser();

  async function handleLogout() {
    try {
      await logoutUser();

      queryClient.setQueryData(["currentUser"], null);

      navigate({
        to: "/",
      });
    } catch (error) {
      console.error(error);
    }
  }

  function handleLogoClick() {
    navigate({
      to: user ? "/repositories" : "/",
    });
  }

  return (
    <nav className="border-b border-zinc-800 bg-black">
      <div className="flex h-14 max-w-7xl mx-auto items-center justify-between px-6">
        <p
          className="cursor-pointer font-semibold text-white"
          onClick={handleLogoClick}
        >
          Astro
        </p>

        <div className="flex items-center gap-6 text-sm">
          {!isLoading && user ? (
            <>
              <NavLink to="/repositories" icon={<Github size={16} />}>
                Repositories
              </NavLink>

              <NavLink to="/settings" icon={<Settings size={16} />}>
                Settings
              </NavLink>

              <button
                className="flex items-center gap-2 text-zinc-400 transition hover:text-white"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            !isLoading && (
              <>
                <button
                  className="text-zinc-300 transition hover:text-white"
                  onClick={() => navigate({ to: "/login" })}
                >
                  Sign in
                </button>

                <button
                  className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-black transition hover:bg-zinc-200"
                  onClick={() => navigate({ to: "/signup" })}
                >
                  Get Started
                  <ArrowRight size={12} />
                </button>
              </>
            )
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  to,
  icon,
  children,
}: {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="
        flex items-center gap-2
        text-zinc-400
        transition
        hover:text-white
        [&.active]:text-white
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
            {children}
          </span>
        </>
      )}
    </Link>
  );
}
