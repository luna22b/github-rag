import { createFileRoute, redirect } from "@tanstack/react-router";
import Header from "#/components/Header";
import ButtonsHeader from "#/components/ButtonsHeader";
import axios from "axios";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    try {
      await axios.get("http://localhost:8000/api/auth/me", {
        withCredentials: true,
      });

      throw redirect({
        to: "/repositories",
      });
    } catch (error) {
      if (error instanceof Response) {
        throw error;
      }
    }
  },

  component: Home,
});

function Home() {
  return (
    <div>
      <Header />
      <ButtonsHeader />
    </div>
  );
}
