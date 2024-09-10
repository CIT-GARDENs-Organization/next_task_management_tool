"use client";
import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {createClient} from "@/utils/supabase/client";

interface SessionContextProps {
  session: any;
  loading: boolean;
  setSession: (session: any) => void;
}

export const SessionContext = createContext<SessionContextProps | undefined>(
  undefined
);

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}

export function SessionProvider({children}: {children: ReactNode}) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const supabase = createClient();
      const {data} = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };

    fetchSession();
  }, []);

  const value = {
    session,
    loading,
    setSession,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}
