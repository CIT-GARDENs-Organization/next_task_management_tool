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

## Supabase（バックエンド）操作方法

`/supabase`フォルダ下には、SupabaseのEdgeFunctionのコードや、migrationファイルが置かれています．

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

`tle-fetch`関数が`tle`テーブルにTLEを保存したとき、そのinsertをトリガとしたWebhookでよびだされる．

#### ローカルでのテスト方法

```bash
supabase start
supabase status
supabase functions serve
```

```bash
curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/tle-update-webhook' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
  --header 'Content-Type: application/json' \
  --data '{
    "type": "INSERT",
    "table": "tle",
    "record": {
      "id": 265,
      "name": "SAKURA",
      "content": "OBJECT WU               \r\n1 60954U 98067WU  24247.60248306  .00115501  00000+0  19272-2 0  9997\r\n2 60954  51.6391 286.8206 0013428 314.7580  45.2651 15.50985581   818\r\n",
      "norad_id": 60954,
      "created_at": "2024-09-04T21:00:07.351294+00:00"
    },
    "schema": "public",
    "old_record": null
  }'
```

```bash
supabase stop
```
