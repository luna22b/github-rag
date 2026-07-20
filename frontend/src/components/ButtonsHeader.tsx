import { ArrowRight } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export default function ButtonsHeader() {
  const navigate = useNavigate();

  return (
    <div className="mt-8 flex justify-center gap-4">
      <button
        className="text-white rounded-lg px-4 py-2 flex justify-center items-center gap-1 bg-[oklch(0.62_0.19_255)] text-sm cursor-pointer"
        onClick={() => navigate({ to: "/signup" })}
      >
        Get Started
        <ArrowRight size={12} />
      </button>
      <button
        className="rounded-md border border-[oklch(0.27_0.005_285)] bg-white/5 px-5 py-2.5 text-sm text-white cursor-pointer"
        onClick={() => navigate({ to: "/login" })}
      >
        Sign in
      </button>
    </div>
  );
}
