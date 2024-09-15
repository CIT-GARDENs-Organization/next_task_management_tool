"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {useEffect, useState} from "react";
import useSWR from "swr";
import {useSession} from "@/providers/sessionProvider";
import {createClient} from "@/utils/supabase/client";
import {CreateUserDetail} from "@/components/CreateUserDetail";

const supabase = createClient();

// データフェッチ用の関数
const fetcher = async (authId: string) => {
  const {data, error} = await supabase
    .from("user_details")
    .select("*")
    .eq("auth_id", authId);

  if (error) {
    throw new Error(error.message);
  }

  console.log(data);

  return data;
};

export default function Dashboard() {
  const {session, loading} = useSession();

  const {data: userDetails, error} = useSWR(
    session ? session.user.id : null,
    fetcher
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!session || !session.user) {
    return <p>No user session found. Please sign in.</p>;
  }

  if (error) {
    return <p>Error loading user details: {error.message}</p>;
  }

  if (userDetails?.length === 0) {
    return <CreateUserDetail authId={session.user.id} />;
  }

  return (
    <main className="bg-neutral-50 w-full p-12 grid grid-cols-1 sm:md:grid-cols-2 lg:grid-cols-3 gap-8">
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-full">
          <h1>Welcome to your dashboard, {session.user.email}!</h1>
        </CardContent>
      </Card>
      {/* ... other cards ... */}
    </main>
  );
}
