"use client";

import {useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {signUp} from "@/lib/signUp";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);

    // フォームデータの作成
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const result = await signUp(formData);

    if (!result.supabase?.success) {
      setMessage(result.supabase?.message || "ユーザー作成に失敗しました");
      setIsError(true);
    } else {
      setMessage(
        "ユーザー作成に成功しました　メール宛に確認メールを送信しました"
      );
      setIsError(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Create a New Account</h1>
      <form
        className="flex flex-col gap-4 w-full max-w-md"
        onSubmit={handleSignUp}
      >
        <label className="flex flex-col gap-2">
          <span className="font-medium text-sm">Email</span>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="font-medium text-sm">Password</span>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {message && (
          <p className={isError ? "text-red-500" : "text-green-500"}>
            {message}
          </p>
        )}

        <Button type="submit" className="mt-4">
          Sign Up
        </Button>
      </form>
    </div>
  );
}
