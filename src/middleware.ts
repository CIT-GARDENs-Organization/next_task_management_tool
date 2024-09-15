import {NextRequest, NextResponse} from "next/server";
import {createServerClient} from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Supabaseサーバークライアントの作成
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({name, value, options}) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // セッションの取得
  const {
    data: {session},
  } = await supabase.auth.getSession();

  const {pathname} = new URL(request.url);

  // セッションがない場合、'/dashboard' へのアクセスを '/' にリダイレクト
  if (!session && pathname === "/dashboard") {
    console.log("No session, redirecting to /");
    return NextResponse.redirect(new URL("/", request.url));
  }

  // セッションがある状態で '/' にアクセスしたら '/dashboard' にリダイレクト
  if (session && pathname === "/") {
    console.log("Session exists, redirecting to /dashboard");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 他のリクエストはそのまま処理
  return response;
}

export const config = {
  matcher: ["/", "/dashboard"], // 適用するパス
};
