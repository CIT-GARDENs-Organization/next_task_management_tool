# Next Task Management Tool

## 概要

衛星運用にあたって必要な運用計画を立てるためのWebアプリケーションです．

## フロントエンド開発環境 起動方法

このプロジェクトはNext.jsで作成されています．
次の手順に従い、ローカル開発用サーバーを起動できます．

1. 環境変数ファイルの作成

    `.env.example`を参考に、ルート直下に`.env.local`ファイルを作成します．

2. 環境変数の入力

    管理者に`<SUBSTITUTE_SUPABASE_URL>`と`<SUBSTITUTE_SUPABASE_ANON_KEY>`を問い合わせ、該当箇所を置き換えて保存します．

    ```bash
    NEXT_PUBLIC_SUPABASE_URL=<SUBSTITUTE_SUPABASE_URL>
    NEXT_PUBLIC_SUPABASE_ANON_KEY=<SUBSTITUTE_SUPABASE_ANON_KEY>
    ```

3. 開発用サーバーの起動
    Next.jsの開発用サーバーを起動します．

    ```bash
    npm i
    npm run dev
    ```

## Supabase（バックエンド）

`/supabase`フォルダ下には、SupabaseのEdgeFunctionのコードや、migrationファイルが置かれています．

### remoteの変更のpull

```bash
supabase db pull
supabase migration up
```

### Supabase型定義ファイルの更新

```bash
supabase gen types typescript --local > ../src/types/supabase.ts
```
