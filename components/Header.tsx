"use client";

import ThemeToggle from "@/components/ThemeToggle";
import { ExportChatButton } from "@/components/ExportChatButton";
import { Button } from "@/components/ui/button";
import { User, Menu } from "lucide-react";
import { useState } from "react";

type Message = { role: string; content: string };

export default function Header({ messages }: { messages: Message[] }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full flex items-center justify-between p-4 bg-teal-50 dark:bg-gray-800 shadow-md rounded-lg">
      {/* Left: Logo / Title */}
      <div className="flex items-center gap-2">
        <div className="text-xl font-bold text-black dark:text-white">
          AI Knowledge Assistant
        </div>
        <span className="text-sm text-teal-600/80 dark:text-teal-400/80">v1.0</span>
      </div>

      {/* Right: Desktop Actions */}
      <div className="hidden md:flex items-center gap-3">
        <ExportChatButton messages={messages} />
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-teal-600 hover:bg-teal-100 dark:text-teal-400 dark:hover:bg-gray-700"
        >
          <User className="w-5 h-5" />
        </Button>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-full text-teal-600 hover:bg-teal-100 dark:text-teal-400 dark:hover:bg-gray-700"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 right-4 z-50 flex flex-col gap-2 p-4 bg-teal-50 dark:bg-gray-800 rounded-lg shadow-md md:hidden">
          <ExportChatButton messages={messages} />
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-teal-600 hover:bg-teal-100 dark:text-teal-400 dark:hover:bg-gray-700"
          >
            <User className="w-5 h-5" />
          </Button>
        </div>
      )}
    </header>
  );
}
