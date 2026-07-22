import { Github } from "lucide-react";

function GithubLoginButton() {
  const handleGithubLogin = () => {
    window.location.href = "http://localhost:8000/api/auth/github/login";
  };

  return (
    <button
      type="button"
      onClick={handleGithubLogin}
      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-[oklch(0.27_0.005_285)] bg-black px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-900"
    >
      <Github className="h-4 w-4" />
      Continue with GitHub
    </button>
  );
}

export default GithubLoginButton;
