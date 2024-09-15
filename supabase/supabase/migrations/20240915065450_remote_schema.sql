create extension if not exists "pg_net" with schema "public" version '0.8.0';

create table "public"."user_details" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "unit_no" bigint,
    "last_name" text,
    "first_name" text,
    "auth_id" uuid
);


alter table "public"."tle" disable row level security;

CREATE UNIQUE INDEX user_details_pkey ON public.user_details USING btree (id);

alter table "public"."user_details" add constraint "user_details_pkey" PRIMARY KEY using index "user_details_pkey";

alter table "public"."user_details" add constraint "user_details_auth_id_fkey" FOREIGN KEY (auth_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."user_details" validate constraint "user_details_auth_id_fkey";

grant delete on table "public"."user_details" to "anon";

grant insert on table "public"."user_details" to "anon";

grant references on table "public"."user_details" to "anon";

grant select on table "public"."user_details" to "anon";

grant trigger on table "public"."user_details" to "anon";

grant truncate on table "public"."user_details" to "anon";

grant update on table "public"."user_details" to "anon";

grant delete on table "public"."user_details" to "authenticated";

grant insert on table "public"."user_details" to "authenticated";

grant references on table "public"."user_details" to "authenticated";

grant select on table "public"."user_details" to "authenticated";

grant trigger on table "public"."user_details" to "authenticated";

grant truncate on table "public"."user_details" to "authenticated";

grant update on table "public"."user_details" to "authenticated";

grant delete on table "public"."user_details" to "service_role";

grant insert on table "public"."user_details" to "service_role";

grant references on table "public"."user_details" to "service_role";

grant select on table "public"."user_details" to "service_role";

grant trigger on table "public"."user_details" to "service_role";

grant truncate on table "public"."user_details" to "service_role";

grant update on table "public"."user_details" to "service_role";


