import { createFileRoute } from "@tanstack/react-router";
import Header from "#/components/Header";
import ButtonsHeader from "#/components/ButtonsHeader";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div>
      <Header />
      <ButtonsHeader />
    </div>
  );
}
