"use client";

import React from "react";
import ReactMarkdown from "react-markdown";

type MessageBubbleProps = {
  role: "user" | "assistant";
  content: string;
};

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
  <div className="flex items-end gap-2">
    {!isUser && (
      <div className="w-8 h-8 rounded-full bg-teal-400 text-white flex items-center justify-center font-bold">
        AI
      </div>
    )}

    <div
      className={`
        max-w-[70%] p-3 rounded-lg
        ${isUser ? "bg-blue-500 text-white rounded-br-none" : "bg-teal-100/50 text-gray-900 rounded-bl-none"}
        shadow break-words
      `}
    >
      <div className="prose prose-sm">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>

    {isUser && (
      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
        U
      </div>
    )}
  </div>
</div>

  );
}



