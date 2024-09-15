"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface UserTileProps {
  lastName: string;
  firstName: string;
  email: string;
  unitNo: number;
  // Add other props as needed, e.g., profile picture URL
}

export function UserTile({lastName, firstName, email, unitNo}: UserTileProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{`${lastName} ${firstName}`}</CardTitle>
        <CardDescription>{email}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{unitNo}号機</p>
      </CardContent>
    </Card>
  );
}
