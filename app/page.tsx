"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function HomePage() {
  const [dots, setDots] = useState<
    { top: string; left: string; delay: string; duration: string }[]
  >([]);

  useEffect(() => {
    const generatedDots = Array.from({ length: 20 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${5 + Math.random() * 5}s`,
    }));
    setDots(generatedDots);
  }, []);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-gradient-to-br from-blue-50 via-teal-50 to-blue-100">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <span className="absolute w-72 h-72 bg-blue-100/50 rounded-full top-[-10%] left-[-10%] animate-slow-pulse"></span>
        <span className="absolute w-96 h-96 bg-teal-100/50 rounded-full bottom-[-15%] right-[-10%] animate-slow-pulse"></span>
        <span className="absolute w-56 h-56 bg-teal-200/50 rounded-full top-[30%] right-[-15%] animate-slow-pulse"></span>

        {/* Only render dots on client */}
        {dots.map((dot, i) => (
          <span
            key={i}
            className="absolute w-2 h-2 bg-teal-200/40 rounded-full animate-float"
            style={{
              top: dot.top,
              left: dot.left,
              animationDelay: dot.delay,
              animationDuration: dot.duration,
            }}
          ></span>
        ))}
      </div>

      <div className="relative z-10 flex h-full items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-2xl border border-white/30 bg-white/40 backdrop-blur-md hover:scale-105 transition-transform duration-300">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-extrabold text-slate-900">
              AI Knowledge Assistant
            </CardTitle>
            <CardDescription className="text-slate-700 mt-2">
              Explore insights, get recommendations, and manage your AI knowledge efficiently.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 mt-4">
            <Link href="/dashboard">
              <Button className="w-full bg-gradient-to-r from-blue-400 via-teal-300 to-teal-400 text-white hover:scale-105 transition-transform">
                Go to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
