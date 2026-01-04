"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import MessageBubble from "./MessageBubble";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export type Message = { role: "user" | "assistant"; content: string };

type ChatBoxProps = {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
};

const PROMPTS = {
  explain: "Explain this in simple terms:\n",
  quiz: "Create a short quiz about:\n",
  notes: "Summarize this as notes:\n",
};

export default function ChatBox({ messages, setMessages }: ChatBoxProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load messages from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("chat");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem("chat", JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  const sendMessage = async (prefix = "") => {
    if (!input.trim()) return;

    const userMessage = prefix + input;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!res.body) throw new Error("No response from AI.");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let aiMessage = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.replace("data: ", "").trim();
          if (data === "[DONE]") break;

          try {
            const json = JSON.parse(data);
            const token = json.choices?.[0]?.delta?.content;
            if (token) {
              aiMessage += token;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1].content = aiMessage;
                return updated;
              });
            }
          } catch {
            // ignore malformed
          }
        }
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-blue-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="flex md:flex flex-col w-64 p-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow gap-4 h-screen overflow-y-auto">
        <h2 className="text-xl font-semibold mb-3">Quick Prompts</h2>
        {Object.entries(PROMPTS).map(([key, prompt]) => (
          <Button
            key={key}
            size="sm"
            variant="outline"
            className="text-teal-700 dark:text-teal-400 border-teal-300 dark:border-teal-600 hover:bg-teal-200 dark:hover:bg-teal-600 hover:text-white rounded-md"
            onClick={() => sendMessage(prompt)}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </Button>
        ))}
      </aside>

      {/* Chat Area */}
      <div className="flex flex-col flex-1">
        <Card className="flex flex-col flex-1 p-0 dark:bg-gray-900 shadow-inner rounded-lg">
          <ScrollArea
            ref={scrollRef}
            className="scroll-area flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-gray-800 rounded-t-lg"
            style={{ minHeight: 0 }}
          >
            {messages.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 mt-20">
                <p className="text-lg font-medium mb-2">Welcome to Chat!</p>
                <p className="text-sm text-center max-w-xs">
                  Type a message or use one of the quick prompts on the left to
                  start a conversation with the assistant.
                </p>
              </div>
            )}

            {messages.map((m, i) => (
              <MessageBubble key={i} {...m} />
            ))}

            {loading && (
              <div className="flex gap-2 items-center">
                <div className="w-3 h-3 bg-teal-300 dark:bg-teal-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-teal-300 dark:bg-teal-500 rounded-full animate-bounce delay-150"></div>
                <div className="w-3 h-3 bg-teal-300 dark:bg-teal-500 rounded-full animate-bounce delay-300"></div>
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <div className="flex flex-col md:flex-row gap-2 p-4 bg-teal-50 dark:bg-gray-700 rounded-b-lg border-t border-gray-200 dark:border-gray-600">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 resize-none bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 focus:border-teal-400 focus:ring focus:ring-teal-200 dark:focus:ring-teal-500 rounded-md text-gray-900 dark:text-gray-100"
            />
            <div className="flex gap-2 mt-2 md:mt-0">
              <Button
                className="h-[50px] w-[75px] bg-teal-400 dark:bg-teal-600 text-white rounded-md"
                onClick={() => sendMessage()}
                disabled={loading}
              >
                Send
              </Button>
              <Button
                className="h-[50px] w-[85px] border border-teal-400 dark:border-teal-500 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-700 rounded-md"
                variant="outline"
                onClick={() => setMessages([])}
              >
                Clear
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
