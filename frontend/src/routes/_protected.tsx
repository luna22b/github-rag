import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import axios from "axios";
import { API_URL } from "#/config";

export const Route = createFileRoute("/_protected")({
  beforeLoad: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/me`, {
        withCredentials: true,
      });

      return {
        user: response.data,
      };
    } catch (error) {
      throw redirect({
        to: "/login",
      });
    }
  },

  component: ProtectedLayout,
});

function ProtectedLayout() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <main className="min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
