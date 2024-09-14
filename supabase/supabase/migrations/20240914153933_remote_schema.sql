create extension if not exists "pg_net" with schema "public" version '0.8.0';

alter table "public"."satellite_schedule" add column "tle_id" bigint;

alter table "public"."satellite_schedule" add constraint "satellite_schedule_tle_id_fkey" FOREIGN KEY (tle_id) REFERENCES tle(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."satellite_schedule" validate constraint "satellite_schedule_tle_id_fkey";


