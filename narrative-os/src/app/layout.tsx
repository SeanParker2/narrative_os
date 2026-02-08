import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'sonner';
import { CommandNexus } from "@/components/CommandNexus";

export const metadata: Metadata = {
  title: "Narrative OS",
  description: "Global Sentiment Intelligence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen font-sans">
        {/* Command Nexus (Global Command Palette) */}
        <CommandNexus />
        
        <main className="min-h-screen">
            {children}
        </main>
        <Toaster position="top-center" theme="dark" toastOptions={{
            style: {
                background: 'rgba(17, 24, 39, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
                backdropFilter: 'blur(10px)'
            }
        }} />
      </body>
    </html>
  );
}
