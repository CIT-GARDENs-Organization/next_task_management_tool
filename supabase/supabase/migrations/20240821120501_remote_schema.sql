create extension if not exists "pg_net" with schema "public" version '0.8.0';

alter table "public"."satellite_list" add column "last_updated" timestamp with time zone;

alter table "public"."satellite_list" add column "status" text;


