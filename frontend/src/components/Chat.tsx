import { useEffect, useState } from "react";
import { sendMessage, getChat } from "#/api/chat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Source = {
  id: number;
  file: string;
};

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
};

type ChatProps = {
  chatId: number | null;
};

export default function Chat({ chatId }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadMessages() {
      if (!chatId) {
        setMessages([]);
        return;
      }

      const data = await getChat(chatId);

      setMessages(
        data.messages.map((message: any) => ({
          role: message.role,
          content: message.content,
          sources: [],
        })),
      );
    }

    loadMessages();
  }, [chatId]);

  async function sendMessageHandler() {
    if (!input.trim() || loading || !chatId) return;

    const question = input;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: question,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const data = await sendMessage(chatId, question);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer,
          sources: data.sources.map((file: string, index: number) => ({
            id: index,
            file,
          })),
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong while asking the repository.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-6 overflow-y-auto pr-2">
        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.role === "user"
                ? "flex justify-end"
                : "flex justify-start"
            }
          >
            <div
              className={`
                max-w-3xl rounded-xl px-5 py-4
                ${
                  message.role === "user"
                    ? "bg-[oklch(0.62_0.19_255)] text-black"
                    : "border border-zinc-800 bg-zinc-900 text-zinc-200"
                }
              `}
            >
              <div className="prose prose-invert max-w-none text-sm leading-7">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ children, className }) {
                      return (
                        <code
                          className={`
                            rounded
                            bg-zinc-800
                            px-1.5
                            py-1
                            text-sm
                            text-zinc-200
                            ${className ?? ""}
                          `}
                        >
                          {children}
                        </code>
                      );
                    },

                    h2({ children }) {
                      return (
                        <h2 className="mb-3 mt-5 text-xl font-semibold text-white">
                          {children}
                        </h2>
                      );
                    },

                    h3({ children }) {
                      return (
                        <h3 className="mb-2 mt-4 text-lg font-medium text-white">
                          {children}
                        </h3>
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>

              {message.sources && message.sources.length > 0 && (
                <div className="mt-5 border-t border-zinc-800 pt-4">
                  <p className="mb-2 text-xs font-medium text-zinc-500">
                    Sources
                  </p>

                  <div className="space-y-1">
                    {message.sources.map((source) => (
                      <div key={source.id} className="text-xs text-zinc-400">
                        📄 {source.file}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4 text-sm text-zinc-400">
              Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex gap-3 border-t border-zinc-800 pt-4">
        <input
          className="
            flex-1
            rounded-lg
            border border-zinc-800
            bg-zinc-900
            px-4 py-3
            text-sm
            text-white
            outline-none
            transition
            focus:border-zinc-600
            placeholder:text-zinc-500
          "
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            chatId ? "Ask about this repository..." : "Select a chat first..."
          }
          disabled={!chatId}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              sendMessageHandler();
            }
          }}
        />

        <button
          onClick={sendMessageHandler}
          disabled={loading || !chatId}
          className="
            rounded-lg
            bg-[oklch(0.62_0.19_255)]
            px-5 py-3
            text-sm
            font-medium
            text-black
            transition
            hover:opacity-90
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
