import { ArrowRight } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav>
      <div className="flex justify-between max-w-7xl mx-auto px-6 h-14 items-center border-b border-b-[oklch(0.27_0.005_285)]">
        <p className="text-white font-semibold text-md">MD</p>
        <div className="flex gap-4 text-xs items-center">
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
        </div>
      </div>
    </nav>
  );
}
