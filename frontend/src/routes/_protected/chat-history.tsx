import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/chat-history')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/search"!</div>
}
