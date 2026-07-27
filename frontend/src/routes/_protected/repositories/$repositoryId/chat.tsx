import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import Chat from "@/components/Chat";
import ChatList from "@/components/ChatList";

export const Route = createFileRoute(
  "/_protected/repositories/$repositoryId/chat",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { repositoryId } = Route.useParams();

  const [chatId, setChatId] = useState<number | null>(null);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-black px-4 py-6 text-white sm:px-6">
      <div className="mx-auto flex h-[calc(100vh-6rem)] max-w-7xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 shadow-xl">
        <aside className="flex w-72 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950/60">
          <div className="border-b border-zinc-800 px-5 py-5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Repository
            </p>

            <div className="mt-2 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[oklch(0.62_0.19_255)]" />

              <p className="truncate text-sm font-medium text-white">
                Repository #{repositoryId}
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <ChatList
              repositoryId={Number(repositoryId)}
              selectedChatId={chatId}
              onSelectChat={setChatId}
              onNewChat={setChatId}
            />
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col bg-zinc-950/40">
          <header className="border-b border-zinc-800 px-6 py-5">
            <h1 className="text-lg font-semibold text-white">
              Repository Chat
            </h1>

            <p className="mt-1 text-sm text-zinc-400">
              Ask questions and explore your codebase.
            </p>
          </header>

          <div className="min-h-0 flex-1">
            <Chat chatId={chatId} />
          </div>
        </main>
      </div>
    </div>
  );
}
