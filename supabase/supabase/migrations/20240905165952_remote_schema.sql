create extension if not exists "pg_net" with schema "public" version '0.8.0';

create table "public"."satellite_schedule" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "satellite_id" uuid,
    "name" text,
    "pass_start_time" timestamp with time zone,
    "pass_end_time" timestamp with time zone,
    "max_elevation" double precision,
    "azimuth_start" double precision,
    "azimuth_end" double precision,
    "updates_count" bigint,
    "tle_updated_at" timestamp with time zone
);


CREATE UNIQUE INDEX satellite_schedule_pkey ON public.satellite_schedule USING btree (id);

alter table "public"."satellite_schedule" add constraint "satellite_schedule_pkey" PRIMARY KEY using index "satellite_schedule_pkey";

alter table "public"."satellite_schedule" add constraint "satellite_schedule_name_fkey" FOREIGN KEY (name) REFERENCES satellite_list(name) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."satellite_schedule" validate constraint "satellite_schedule_name_fkey";

alter table "public"."satellite_schedule" add constraint "satellite_schedule_satellite_id_fkey" FOREIGN KEY (satellite_id) REFERENCES satellite_list(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."satellite_schedule" validate constraint "satellite_schedule_satellite_id_fkey";

grant delete on table "public"."satellite_schedule" to "anon";

grant insert on table "public"."satellite_schedule" to "anon";

grant references on table "public"."satellite_schedule" to "anon";

grant select on table "public"."satellite_schedule" to "anon";

grant trigger on table "public"."satellite_schedule" to "anon";

grant truncate on table "public"."satellite_schedule" to "anon";

grant update on table "public"."satellite_schedule" to "anon";

grant delete on table "public"."satellite_schedule" to "authenticated";

grant insert on table "public"."satellite_schedule" to "authenticated";

grant references on table "public"."satellite_schedule" to "authenticated";

grant select on table "public"."satellite_schedule" to "authenticated";

grant trigger on table "public"."satellite_schedule" to "authenticated";

grant truncate on table "public"."satellite_schedule" to "authenticated";

grant update on table "public"."satellite_schedule" to "authenticated";

grant delete on table "public"."satellite_schedule" to "service_role";

grant insert on table "public"."satellite_schedule" to "service_role";

grant references on table "public"."satellite_schedule" to "service_role";

grant select on table "public"."satellite_schedule" to "service_role";

grant trigger on table "public"."satellite_schedule" to "service_role";

grant truncate on table "public"."satellite_schedule" to "service_role";

grant update on table "public"."satellite_schedule" to "service_role";


