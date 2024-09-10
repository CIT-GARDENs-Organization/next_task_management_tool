import {NextRequest, NextResponse} from "next/server";
import {createServerClient} from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next();

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

  console.log(supabase);

  // セッションの取得
  const session = await supabase.auth.getSession();

  console.log(session);

  const {pathname} = new URL(request.url);

  // セッションがある状態で '/' にアクセスしたら '/dashboard' にリダイレクト
  if (session && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // セッションがない状態で '/dashboard' にアクセスしたら '/' にリダイレクト
  if (!session && pathname === "/dashboard") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 他のリクエストはそのまま処理
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard"], // 適用するパス
};
