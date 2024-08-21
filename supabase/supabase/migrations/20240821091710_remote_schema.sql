create extension if not exists "pg_net" with schema "public" version '0.8.0';

create table "public"."satellite_list" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "name" text not null,
    "norad_id" bigint,
    "tle_fetch_on" boolean
);


CREATE UNIQUE INDEX satellite_list_pkey ON public.satellite_list USING btree (id);

alter table "public"."satellite_list" add constraint "satellite_list_pkey" PRIMARY KEY using index "satellite_list_pkey";

grant delete on table "public"."satellite_list" to "anon";

grant insert on table "public"."satellite_list" to "anon";

grant references on table "public"."satellite_list" to "anon";

grant select on table "public"."satellite_list" to "anon";

grant trigger on table "public"."satellite_list" to "anon";

grant truncate on table "public"."satellite_list" to "anon";

grant update on table "public"."satellite_list" to "anon";

grant delete on table "public"."satellite_list" to "authenticated";

grant insert on table "public"."satellite_list" to "authenticated";

grant references on table "public"."satellite_list" to "authenticated";

grant select on table "public"."satellite_list" to "authenticated";

grant trigger on table "public"."satellite_list" to "authenticated";

grant truncate on table "public"."satellite_list" to "authenticated";

grant update on table "public"."satellite_list" to "authenticated";

grant delete on table "public"."satellite_list" to "service_role";

grant insert on table "public"."satellite_list" to "service_role";

grant references on table "public"."satellite_list" to "service_role";

grant select on table "public"."satellite_list" to "service_role";

grant trigger on table "public"."satellite_list" to "service_role";

grant truncate on table "public"."satellite_list" to "service_role";

grant update on table "public"."satellite_list" to "service_role";


