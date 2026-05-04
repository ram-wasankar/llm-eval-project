import type { ReactNode } from "react";

import "./globals.css";

export const metadata = {
  title: "LLM Observability & Eval Platform",
  description: "Observe, evaluate, and analyze Gemini-powered LLM traffic."
};

export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-sky font-body text-ink antialiased">{children}</body>
    </html>
  );
}
