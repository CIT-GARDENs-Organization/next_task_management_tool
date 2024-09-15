"use client";
import {useState} from "react";
import NavigationBar from "@/components/NavigationBar";
import {useSession} from "@/providers/sessionProvider";

export default function ClientWrapper({children}: {children: React.ReactNode}) {
  const [navWidth, setNavWidth] = useState("4rem");
  const {session} = useSession();

  // session がない場合は全画面表示
  if (!session) {
    return (
      <main className="bg-neutral-50 w-full h-screen overflow-y-auto">
        {children}
      </main>
    );
  }

  // session がある場合は NavigationBar を表示
  return (
    <div className="flex w-full">
      <NavigationBar setNavWidth={setNavWidth} />
      <main
        className="bg-neutral-50 flex-grow h-screen overflow-y-auto transition-all duration-300"
        style={{marginLeft: navWidth}}
      >
        {children}
      </main>
    </div>
  );
}
