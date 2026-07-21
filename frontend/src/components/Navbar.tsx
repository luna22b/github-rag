import { ArrowRight } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "../api/auth";

import { useCurrentUser } from "../hooks/useCurrentUser";

export default function Navbar() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useCurrentUser();

  async function handleLogout() {
    const success = await logoutUser();

    if (!success) {
      return;
    }

    await queryClient.invalidateQueries({
      queryKey: ["currentUser"],
    });

    navigate({
      to: "/",
    });
  }

  function handleLogoClick() {
    if (user) {
      navigate({
        to: "/dashboard",
      });
    } else {
      navigate({
        to: "/",
      });
    }
  }

  return (
    <nav>
      <div className="flex justify-between max-w-7xl mx-auto px-6 h-14 items-center border-b border-b-[oklch(0.27_0.005_285)]">
        <p
          className="text-white font-semibold text-md cursor-pointer"
          onClick={handleLogoClick}
        >
          MD
        </p>

        <div className="flex gap-4 text-xs items-center">
          {!isLoading && user ? (
            <button
              className="text-black rounded-lg px-3 py-1.5 bg-[oklch(0.965_0.002_285)] cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            !isLoading && (
              <>
                <button
                  className="text-white cursor-pointer"
                  onClick={() => navigate({ to: "/login" })}
                >
                  Sign in
                </button>

                <button
                  className="text-black rounded-lg px-3 py-1.5 flex justify-center items-center gap-1 bg-[oklch(0.965_0.002_285)] cursor-pointer"
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
