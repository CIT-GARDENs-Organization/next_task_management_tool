import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import Image from "next/image";
import {Settings, Home, Users2, LineChart, Clock} from "lucide-react";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Gardens Task Manager",
  description: "A task manager for the Gardens team",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.className} flex`}>
        <aside className="fixed inset-y-0 left-0 z-20 w-14 flex flex-col items-center border-r bg-white">
          <Image
            src="/gardens_logo.png"
            alt="Gardens Task Manager"
            width={30}
            height={30}
            className="mt-4"
          />
          <Home size={24} className="mt-8" />
          <LineChart size={24} className="mt-6" />
          <Users2 size={24} className="mt-6" />
          <Clock size={24} className="mt-6" />
          <div className="flex-grow" />
          <Settings size={24} className="mb-8" />
        </aside>

        <main className="bg-neutral-50 ml-14 flex-1 h-screen overflow-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
