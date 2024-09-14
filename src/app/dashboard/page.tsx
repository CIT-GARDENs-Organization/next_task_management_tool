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
import {useSession} from "@/providers/sessionProvider";

export default function Dashboard() {
  const {session, loading} = useSession();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!session || !session.user) {
    return <p>No user session found. Please sign in.</p>;
  }

  return (
    <main className="bg-neutral-50w-full p-12 grid grid-cols-1 sm:md:grid-cols-2 lg:grid-cols-3 gap-8">
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-full">
          <h1>Welcome to your dashboard, {session.user.email}!</h1>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Card Title 2</CardTitle>
          <CardDescription>Card Description 2</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content 2</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer 2</p>
        </CardFooter>
      </Card>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Card Title 3</CardTitle>
          <CardDescription>Card Description 3</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content 3</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer 3</p>
        </CardFooter>
      </Card>
      <Card className="md:col-span-2 w-full">
        <CardHeader>
          <CardTitle>Card Title 4</CardTitle>
          <CardDescription>Card Description 4</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content 4</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer 4</p>
        </CardFooter>
      </Card>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Card Title 5</CardTitle>
          <CardDescription>Card Description 5</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content 5</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer 5</p>
        </CardFooter>
      </Card>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Card Title 6</CardTitle>
          <CardDescription>Card Description 6</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content 6</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer 6</p>
        </CardFooter>
      </Card>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Card Title 6</CardTitle>
          <CardDescription>Card Description 6</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content 6</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer 6</p>
        </CardFooter>
      </Card>
    </main>
  );
}