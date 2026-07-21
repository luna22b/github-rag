import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Github } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/login",
        {
          identifier,
          password,
        },
        {
          withCredentials: true,
        },
      );

      console.log(response.data);

      await queryClient.invalidateQueries({
        queryKey: ["currentUser"],
      });

      navigate({
        to: "/dashboard",
      });
    } catch (error: any) {
      if (error.response?.status === 401) {
        setError("Invalid username/email or password");
      } else {
        setError("Something went wrong. Please try again.");
      }

      console.log(error.response?.data);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Welcome back</h1>

          <p className="mt-2 text-sm text-[oklch(0.56_0.008_285)]">
            Sign in to continue chatting with your repositories.
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-[oklch(0.27_0.005_285)] bg-white/5 p-6">
          <button
            type="button"
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-[oklch(0.27_0.005_285)] bg-black px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-900"
          >
            <Github className="h-4 w-4" />
            Continue with GitHub
          </button>

          <div className="my-6 flex items-center">
            <div className="h-px flex-1 bg-[oklch(0.27_0.005_285)]" />

            <span className="mx-4 text-xs uppercase tracking-wider text-[oklch(0.56_0.008_285)]">
              OR
            </span>

            <div className="h-px flex-1 bg-[oklch(0.27_0.005_285)]" />
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-xs font-light uppercase text-[oklch(0.56_0.008_285)]">
                Email or Username
              </label>

              <input
                type="text"
                placeholder="Enter your email or username"
                className="w-full rounded-md border border-[oklch(0.27_0.005_285)] bg-black/30 px-3 py-2 text-sm text-white placeholder:text-[oklch(0.56_0.008_285)] outline-none transition focus:border-white"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-light uppercase text-[oklch(0.56_0.008_285)]">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                className="w-full rounded-md border border-[oklch(0.27_0.005_285)] bg-black/30 px-3 py-2 text-sm text-white placeholder:text-[oklch(0.56_0.008_285)] outline-none transition focus:border-white"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);

                  if (error) {
                    setError("");
                  }
                }}
                required
              />
            </div>

            {error && (
              <div className="rounded-md border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-md bg-[oklch(0.62_0.19_255)] px-4 py-2.5 text-sm text-white transition hover:opacity-90"
            >
              Sign in
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-[oklch(0.56_0.008_285)]">
          Don't have an account?{" "}
          <span
            className="cursor-pointer text-[oklch(0.62_0.19_255)] transition hover:underline"
            onClick={() => navigate({ to: "/signup" })}
          >
            Create one
          </span>
        </p>
      </div>
    </div>
  );
}
