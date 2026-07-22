import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import axios from "axios";
import Sidebar from "@/components/Sidebar";

export const Route = createFileRoute("/_protected")({
  beforeLoad: async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/auth/me", {
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
      <Sidebar />

      <main className="ml-64 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
