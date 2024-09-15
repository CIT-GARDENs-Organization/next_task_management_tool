"use client";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useState} from "react";
import {createClient} from "@/utils/supabase/client";

const supabase = createClient();

interface CreateUserDetailProps {
  authId: string;
}

export function CreateUserDetail({authId}: CreateUserDetailProps) {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [unitNo, setUnitNo] = useState(1); // Initial value for unit number
  const [isOpen, setIsOpen] = useState(true); // Dialog open state

  const handleSubmit = async () => {
    const {error} = await supabase.from("user_details").insert([
      {
        auth_id: authId, // Use the passed authId here
        last_name: lastName,
        first_name: firstName,
        unit_no: unitNo, // Include unit number in the data
      },
    ]);

    if (error) {
      console.error("Error creating user detail:", error.message);
    } else {
      console.log("User detail created successfully");
      setIsOpen(false); // Close the dialog after successful submission
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>ユーザー詳細情報の作成</DialogTitle>
          <DialogDescription>UserID: {authId}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              姓
            </Label>
            <Input
              id="last_name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="col-span-3"
              placeholder="山田"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              名
            </Label>
            <Input
              id="first_name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="col-span-3"
              placeholder="太郎"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="unit_no" className="text-right">
              号機
            </Label>
            <Input
              id="unit_no"
              type="number" // Set the input type to number
              value={unitNo}
              onChange={(e) => setUnitNo(parseInt(e.target.value, 10))}
              className="col-span-3"
              placeholder="1"
              min={1} // Optional: Set minimum value to 1
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            作成
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
