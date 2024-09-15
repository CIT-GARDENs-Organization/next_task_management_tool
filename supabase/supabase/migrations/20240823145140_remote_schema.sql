create extension if not exists "pg_net" with schema "public" version '0.8.0';

create table "public"."pass_schedule" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "pass_id" bigint,
    "satellite_name" text,
    "start_time" timestamp with time zone,
    "end_time" timestamp with time zone
);


CREATE UNIQUE INDEX pass_schedule_pkey ON public.pass_schedule USING btree (id);

CREATE UNIQUE INDEX satellite_list_name_key ON public.satellite_list USING btree (name);

alter table "public"."pass_schedule" add constraint "pass_schedule_pkey" PRIMARY KEY using index "pass_schedule_pkey";

alter table "public"."pass_schedule" add constraint "pass_schedule_satellite_name_fkey" FOREIGN KEY (satellite_name) REFERENCES satellite_list(name) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."pass_schedule" validate constraint "pass_schedule_satellite_name_fkey";

alter table "public"."satellite_list" add constraint "satellite_list_name_key" UNIQUE using index "satellite_list_name_key";

grant delete on table "public"."pass_schedule" to "anon";

grant insert on table "public"."pass_schedule" to "anon";

grant references on table "public"."pass_schedule" to "anon";

grant select on table "public"."pass_schedule" to "anon";

grant trigger on table "public"."pass_schedule" to "anon";

grant truncate on table "public"."pass_schedule" to "anon";

grant update on table "public"."pass_schedule" to "anon";

grant delete on table "public"."pass_schedule" to "authenticated";

grant insert on table "public"."pass_schedule" to "authenticated";

grant references on table "public"."pass_schedule" to "authenticated";

grant select on table "public"."pass_schedule" to "authenticated";

grant trigger on table "public"."pass_schedule" to "authenticated";

grant truncate on table "public"."pass_schedule" to "authenticated";

grant update on table "public"."pass_schedule" to "authenticated";

grant delete on table "public"."pass_schedule" to "service_role";

grant insert on table "public"."pass_schedule" to "service_role";

grant references on table "public"."pass_schedule" to "service_role";

grant select on table "public"."pass_schedule" to "service_role";

grant trigger on table "public"."pass_schedule" to "service_role";

grant truncate on table "public"."pass_schedule" to "service_role";

grant update on table "public"."pass_schedule" to "service_role";

create policy "Enable update access for anon"
on "public"."satellite_list"
as permissive
for update
to anon
using (true);



