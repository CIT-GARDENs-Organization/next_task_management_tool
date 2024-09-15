"use client";
import {useState, useEffect} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {
  Settings,
  Home,
  LineChart,
  SquareChartGantt,
  CalendarClock,
  FilePlus2,
  User,
  LogOut,
} from "lucide-react";
import React from "react";
import {useSession} from "@/providers/sessionProvider";
import {createClient} from "@/utils/supabase/client";
import Image from "next/image";

export default function NavigationBar({
  setNavWidth,
}: {
  setNavWidth: (width: string) => void;
}) {
  const {session, setSession} = useSession();
  const [isWide, setIsWide] = useState(false);
  const router = useRouter();

  const supabase = createClient();

  useEffect(() => {
    const handleResize = () => {
      const wide = window.innerWidth > 768;
      setIsWide(wide);
      setNavWidth(wide ? "12rem" : "4rem");
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setNavWidth]);

  if (!session) return null;

  // ログアウト処理
  const handleLogout = async () => {
    const {error} = await supabase.auth.signOut();
    if (!error) {
      setSession(null);
      router.push("/");
    } else {
      console.error("Logout error:", error);
    }
  };

  return (
    <div>
      <aside
        className={`fixed inset-y-0 left-0 z-20 ${isWide ? "w-48" : "w-16"} ${
          isWide ? "pl-6" : "pl-4"
        } flex flex-col items-start border-r bg-white transition-all duration-300`}
      >
        <Link href="/">
          <Image
            src="/gardens_logo.png"
            alt="Gardens Task Manager"
            width={30}
            height={30}
            className="mt-4"
          />
        </Link>
        <Link href="/">
          <div className="relative flex items-center mt-8 justify-start hover:text-neutral-500 group">
            <Home size={24} />
            {isWide && <span className="ml-4 font-bold">ホーム</span>}
            {!isWide && <span className="tooltip left-14">ホーム</span>}
          </div>
        </Link>

        <Link href="/dashboard/schedule">
          <div className="relative flex items-center mt-6 justify-start hover:text-neutral-500 group">
            <FilePlus2 size={24} />
            {isWide && <span className="ml-4 font-bold">パス計画作成</span>}
            {!isWide && <span className="tooltip left-14">パス計画作成</span>}
          </div>
        </Link>

        <Link href="/dashboard/operation">
          <div className="relative flex items-center mt-6 justify-start hover:text-neutral-500 group">
            <SquareChartGantt size={24} />
            {isWide && <span className="ml-4 font-bold">運用</span>}
            {!isWide && <span className="tooltip left-14">運用</span>}
          </div>
        </Link>

        <Link href="/dashboard/user">
          <div className="relative flex items-center mt-6 justify-start hover:text-neutral-500 group">
            <User size={24} />
            {isWide && <span className="ml-4 font-bold">ユーザー</span>}
            {!isWide && <span className="tooltip left-14">ユーザー</span>}
          </div>
        </Link>

        <div className="flex-grow" />
        <Link href="/dashboard/settings">
          <div className="relative flex items-center mt-6 justify-start hover:text-neutral-500 group">
            <Settings size={24} />
            {isWide && <span className="ml-4">設定</span>}
            {!isWide && <span className="tooltip left-14">設定</span>}
          </div>
        </Link>

        <div
          className="relative flex items-center mt-6 mb-6 justify-start hover:text-neutral-500 cursor-pointer group"
          onClick={handleLogout}
        >
          <LogOut size={24} />
          {isWide && <span className="ml-4">ログアウト</span>}
          {!isWide && <span className="tooltip left-14">ログアウト</span>}
        </div>
      </aside>
      <style jsx>{`
        .tooltip {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background-color: black;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          opacity: 0;
          white-space: nowrap;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .group:hover .tooltip {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
