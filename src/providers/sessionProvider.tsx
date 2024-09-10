"use client";
import {createContext, useContext, useEffect, useState, ReactNode} from "react";
import {createClient} from "@/utils/supabase/client";

interface SessionContextProps {
  session: any;
  loading: boolean;
}

const SessionContext = createContext<SessionContextProps | undefined>(
  undefined
);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

export const SessionProvider = ({children}: {children: ReactNode}) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchSession = async () => {
      const {data, error} = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
      } else {
        setSession(data.session);
      }
      setLoading(false);
    };

    fetchSession();

    const {data: authListener} = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    const subscription = authListener?.subscription;

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const value = {session, loading};

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};
