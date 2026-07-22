import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = Route.useRouteContext() as { user: { username: string } };

  return (
    <div className="flex bg-[#09090B]">
      <main className="flex-1"></main>
    </div>
  );
}
