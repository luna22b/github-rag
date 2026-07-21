import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import axios from "axios";

export const Route = createFileRoute("/_protected")({
  beforeLoad: async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/me", {
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
  return <Outlet />;
}
