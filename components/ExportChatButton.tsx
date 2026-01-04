"use client";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";

export type Message = { role: string; content: string };

interface ExportChatButtonProps {
  messages: Message[];
}

export function ExportChatButton({ messages }: ExportChatButtonProps) {
  const exportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    const lineHeight = 7;
    let y = margin;
    const fontName = "helvetica";

    messages.forEach((msg) => {
      const roleText = `${msg.role.toUpperCase()}:`;
      const contentLines: string[] = doc.splitTextToSize(msg.content, pageWidth - margin * 2);

      // Role in bold
      doc.setFont(fontName, "bold");
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(roleText, margin, y);
      y += lineHeight;

      // Message content
      doc.setFont(fontName, "normal");
      contentLines.forEach((line: string) => {
        if (y > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin + 5, y); // indent content slightly
        y += lineHeight;
      });

      y += lineHeight; // extra spacing between messages
    });

    doc.save("chat.pdf");
  };

  return (
    <Button variant="outline" size="sm" onClick={exportPDF}>
      Export PDF
    </Button>
  );
}
