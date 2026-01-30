import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Sans, JetBrains_Mono } from "next/font/google";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { AIChatWidget } from "@/components/ai/AIChatWidget";
import { KeyboardShortcutsModal } from "@/components/ui/KeyboardShortcutsModal";
import "./globals.css";

// Primary font - Modern geometric sans-serif
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

// Secondary font - Clean body text
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// Mono font - Code and technical text
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Kanvax - Task Manager with AI",
  description: "A modern task manager with AI-powered suggestions. Organize your tasks, track progress, and get intelligent recommendations.",
  keywords: ["task manager", "productivity", "AI", "kanban", "project management"],
  authors: [{ name: "Chaitanya" }],
  openGraph: {
    title: "Kanvax - Smart Task Manager",
    description: "Organize your work with AI-powered task management",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${jakarta.variable} ${dmSans.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ToastProvider />
        {children}
        <AIChatWidget />
        <KeyboardShortcutsModal />
      </body>
    </html>
  );
}
