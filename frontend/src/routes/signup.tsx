import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

import GithubLoginButton from "@/components/GithubLoginButton";

export const Route = createFileRoute("/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8000/api/auth/signup",
        {
          username,
          email,
          password,
        },
        {
          withCredentials: true,
        },
      );

      await queryClient.invalidateQueries({
        queryKey: ["currentUser"],
      });

      navigate({
        to: "/dashboard",
      });
    } catch (error: any) {
      if (error.response?.status === 400) {
        setError(error.response.data.detail);
      } else {
        setError("Something went wrong. Please try again.");
      }

      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Create your account</h1>

          <p className="mt-2 text-sm text-[oklch(0.56_0.008_285)]">
            Start chatting with your repositories in minutes.
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-[oklch(0.27_0.005_285)] bg-white/5 p-6">
          <GithubLoginButton />

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
                Username
              </label>

              <input
                type="text"
                placeholder="Choose a username"
                className="w-full rounded-md border border-[oklch(0.27_0.005_285)] bg-black/30 px-3 py-2 text-sm text-white placeholder:text-[oklch(0.56_0.008_285)] outline-none transition focus:border-white"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-light uppercase text-[oklch(0.56_0.008_285)]">
                Email
              </label>

              <input
                type="email"
                placeholder="name@example.com"
                className="w-full rounded-md border border-[oklch(0.27_0.005_285)] bg-black/30 px-3 py-2 text-sm text-white placeholder:text-[oklch(0.56_0.008_285)] outline-none transition focus:border-white"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-light uppercase text-[oklch(0.56_0.008_285)]">
                Password
              </label>

              <input
                type="password"
                placeholder="At least 8 characters"
                className="w-full rounded-md border border-[oklch(0.27_0.005_285)] bg-black/30 px-3 py-2 text-sm text-white placeholder:text-[oklch(0.56_0.008_285)] outline-none transition focus:border-white"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
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
              Create account
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-[oklch(0.56_0.008_285)]">
          Already have an account?{" "}
          <span
            className="cursor-pointer text-[oklch(0.62_0.19_255)] transition hover:underline"
            onClick={() =>
              navigate({
                to: "/login",
              })
            }
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}
