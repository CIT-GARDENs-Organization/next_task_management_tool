"use client";
import {Card, CardContent} from "@/components/ui/card";
import {useSession} from "@/providers/sessionProvider";
import {createClient} from "@/utils/supabase/client";
import {CreateUserDetail} from "@/components/CreateUserDetail";
import {UserTile} from "@/components/UserTile"; // Import the UserTile component
import useSWR from "swr";

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

  console.log(userDetails);

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

  // Assuming userDetails is an array and we want the first item
  const user = userDetails?.[0];

  if (!session.user.email) {
    return <p>User email is not available.</p>;
  }

  if (!user) {
    return <p>User details not found.</p>;
  }

  return (
    <main className="bg-neutral-50 w-full p-12 grid grid-cols-1 sm:md:grid-cols-2 lg:grid-cols-3 gap-8">
      <UserTile
        lastName={user.last_name || ""}
        firstName={user.first_name || ""}
        email={session.user.email}
        unitNo={user.unit_no || 0}
      />
      {/* Add more UserTile components */}
    </main>
  );
}
