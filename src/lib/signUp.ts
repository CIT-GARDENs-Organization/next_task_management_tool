"use server";

import {createClient} from "@/utils/supabase/server";

export interface SignUpResponse {
  field?: {
    errors: {
      email?: string[] | undefined;
      password?: string[] | undefined;
    };
  };
  supabase?: {
    success: boolean;
    message?: string;
  };
}

export async function signUp(formData: FormData): Promise<SignUpResponse> {
  const supabase = createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const {error} = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return {
      supabase: {
        success: false,
        message: "ユーザー作成に失敗しました: " + error.message,
      },
    };
  }

  return {
    supabase: {
      success: true,
      message: "ユーザー作成に成功しました",
    },
  };
}
