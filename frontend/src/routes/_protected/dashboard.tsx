import { createFileRoute } from "@tanstack/react-router";
import Sidebar from "#/components/Sidebar";

export const Route = createFileRoute("/_protected/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = Route.useRouteContext() as { user: { username: string } };

  return <div className="flex bg-[#09090B]"></div>;
}
