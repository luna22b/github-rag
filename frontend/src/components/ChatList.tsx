import { useEffect, useState } from "react";
import { getChats, createChat, deleteChat } from "#/api/chat";

type ChatSession = {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
};

type ChatListProps = {
  repositoryId: number;
  selectedChatId: number | null;
  onSelectChat: (chatId: number | null) => void;
  onNewChat: (chatId: number) => void;
};

export default function ChatList({
  repositoryId,
  selectedChatId,
  onSelectChat,
  onNewChat,
}: ChatListProps) {
  const [chats, setChats] = useState<ChatSession[]>([]);

  async function loadChats() {
    const data = await getChats(repositoryId);
    setChats(data);
  }

  useEffect(() => {
    loadChats();
  }, [repositoryId]);

  async function handleNewChat() {
    const chat = await createChat(repositoryId);

    setChats((prev) => [chat, ...prev]);

    onNewChat(chat.id);
  }

  async function handleDeleteChat(chatId: number) {
    await deleteChat(chatId);

    setChats((prev) => prev.filter((chat) => chat.id !== chatId));

    if (selectedChatId === chatId) {
      onSelectChat(null);
    }
  }

  return (
    <div className="flex h-full w-64 flex-col border-r border-zinc-800 bg-zinc-950 p-4">
      <button
        onClick={handleNewChat}
        className="
          mb-4
          rounded-lg
          bg-[oklch(0.62_0.19_255)]
          px-4
          py-2
          text-sm
          font-medium
          text-black
        "
      >
        New Chat
      </button>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`
              flex
              items-center
              justify-between
              rounded-lg
              px-3
              py-2
              text-sm
              ${
                selectedChatId === chat.id
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-900"
              }
            `}
          >
            <button
              onClick={() => onSelectChat(chat.id)}
              className="flex-1 text-left"
            >
              {chat.title}
            </button>

            <button
              onClick={() => handleDeleteChat(chat.id)}
              className="
                ml-2
                text-xs
                text-zinc-500
                hover:text-red-400
              "
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
