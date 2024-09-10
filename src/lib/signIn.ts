"use server";

import {createClient} from "@/utils/supabase/server";

export interface SignInResponse {
  field?: {
    errors: {
      email?: string[] | undefined;
      password?: string[] | undefined;
    };
  };
  supabase?: {
    success: boolean;
    message?: string;
    session?: any;
  };
}

export async function signIn(formData: FormData): Promise<SignInResponse> {
  const supabase = createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const {data, error} = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      supabase: {
        success: false,
        message: "ログインに失敗しました。" + error.message,
      },
    };
  }

  const session = data.session;

  return {
    supabase: {
      success: true,
      message: "ログインに成功しました。",
      session,
    },
  };
}
