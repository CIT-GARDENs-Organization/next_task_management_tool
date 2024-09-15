create extension if not exists "pg_net" with schema "public" version '0.8.0';

alter table "public"."parsed_tle" add column "mean_motion_second_derivative" double precision;


