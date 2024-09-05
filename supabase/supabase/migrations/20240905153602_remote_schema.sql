create extension if not exists "pg_net" with schema "public" version '0.8.0';

alter table "public"."parsed_tle" drop constraint "parsed_tle_id_key";

drop index if exists "public"."parsed_tle_id_key";


