import { createFileRoute, redirect } from "@tanstack/react-router";
import Header from "#/components/Header";
import ButtonsHeader from "#/components/ButtonsHeader";
import axios from "axios";
import HowItWorks from "#/components/HowItWorks";
import { API_URL } from "#/config";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    try {
      await axios.get(`${API_URL}/api/auth/me`, {
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
      <HowItWorks />
    </div>
  );
}
