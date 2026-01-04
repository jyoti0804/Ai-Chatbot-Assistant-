"use client";

import Header from "@/components/Header";
import { useState } from "react";
import ChatBox, { Message } from "@/components/ChatBox"

export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <div className="h-screen flex flex-col gap-4 p-4 bg-background">
      {/* Responsive Header */}
      <Header messages={messages} />

      {/* ChatBox */}
    <ChatBox messages={messages} setMessages={setMessages} />
    </div>
  );
}
