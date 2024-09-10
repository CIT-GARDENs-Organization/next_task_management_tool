import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import RecoilProvider from "@/providers/recoilProvider";
import {SessionProvider} from "@/providers/sessionProvider";
import ClientWrapper from "@/components/ClientWrapper";

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
        <SessionProvider>
          <ClientWrapper>
            <RecoilProvider>{children}</RecoilProvider>
          </ClientWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}
