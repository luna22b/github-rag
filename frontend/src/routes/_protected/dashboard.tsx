import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = Route.useRouteContext() as { user: { username: string } };

  return (
    <div>
      <h1 className="text-white">Hello {user.username}</h1>

      <p className="text-white">You are authenticated.</p>
    </div>
  );
}
