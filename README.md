# Next Task Management Tool

## 概要

衛星運用にあたって必要な運用計画を立てるためのWebアプリケーションである．

## フロントエンド開発環境 起動方法

このプロジェクトはNext.jsで作成されている．
次の手順に従い、ローカル開発用サーバーを起動できる．

1. 環境変数ファイルの作成

    `.env.example`を参考に、ルート直下に`.env.local`ファイルを作成

2. 環境変数の入力

    管理者に`<SUBSTITUTE_SUPABASE_URL>`と`<SUBSTITUTE_SUPABASE_ANON_KEY>`を問い合わせ、該当箇所を置き換えて保存

    ```bash
    NEXT_PUBLIC_SUPABASE_URL=<SUBSTITUTE_SUPABASE_URL>
    NEXT_PUBLIC_SUPABASE_ANON_KEY=<SUBSTITUTE_SUPABASE_ANON_KEY>
    ```

3. 開発用サーバーの起動
    Next.jsの開発用サーバーを起動

    ```bash
    npm i
    npm run dev
    ```

## Supabase（バックエンド）操作方法

`/supabase`フォルダ下には、SupabaseのEdgeFunctionのコードや、migrationファイルが置かれている．

### remoteの変更のpull

```bash
supabase db pull
supabase migration up
```

## Edge Functions

新規Functionの作成

```bash
supabase functions new new-name-function
```

Functionのデプロイ

```bash
supabase functions deploy new-name-function
```

### Supabase型定義ファイルの更新

```bash
supabase gen types typescript --local > ../src/types/supabase.ts
```

## Supabase Edge Functions

`/supabase/supabase/functions/`下にあるSupabase Edge Functionについて述べる．
[Edge Function](https://supabase.com/docs/guides/functions)は、Supabase側で実行できる関数のことであり、クライアントの操作がなくても、任意のトリガを用いて計算を実行し、その結果をDBに保存したり他の動作に使用できる仕組みである．

### tle-fetch

Supabase上の`satellite_list`テーブルに登録された衛星で、`tle_fetch_on`要素が`TRUE`になっている衛星のTLE（2行軌道要素）を[NORAD](https://celestrak.org/)からスクレイピングし、`tle`テーブルに保存する．

PostgreSQLの[`pg_cron`](https://supabase.com/docs/guides/database/extensions/pg_cron?queryGroups=database-method&database-method=sql)拡張を利用したジョブスケジューリングで、3時間に1回定期実行される．

### tle-update-webhook

`tle-fetch`関数が`tle`テーブルにTLEを保存したとき、そのinsertをトリガとしたWebhookで呼び出される．

#### ローカルでのテスト方法

```bash
supabase start
supabase status
supabase functions serve --env-file supabase/.env
```

```bash
curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/tle-update-webhook' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
  --header 'Content-Type: application/json' \
  --data '{
    "type": "INSERT",
    "table": "tle",
    "record": {
      "id": 270,
      "name": "ISS (ZARYA)",
      "content": "ISS (ZARYA)             \r\n1 25544U 98067A   24248.59872094  .00055672  00000+0  99550-3 0  9999\r\n2 25544  51.6408 281.9414 0011614 320.5791 177.4306 15.49387191470866\r\n",
      "norad_id": 25544,
      "created_at": "2024-09-05T06:00:07.802001+00:00",
      "satellite_id": "bbef64c4-14a8-415d-9f51-d2f897172d76"
    },
    "schema": "public",
    "old_record": null
  }'
```

```bash
supabase stop
```

#### 環境変数のremoteへの登録

```bash
supabase secrets set --env-file supabase/.env
```
