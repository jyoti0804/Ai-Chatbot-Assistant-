import { askGroqStream } from "@/lib/groq";

export async function POST(req: Request) {
  const { message } = await req.json();

  const stream = await askGroqStream(message);

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
