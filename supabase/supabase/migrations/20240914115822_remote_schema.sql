create extension if not exists "pg_net" with schema "public" version '0.8.0';

alter table "public"."parsed_tle" alter column "b_star_drag_term" set data type double precision using "b_star_drag_term"::double precision;


