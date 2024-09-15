create extension if not exists "pg_net" with schema "public" version '0.8.0';

alter table "public"."operation" add column "satellite_schedule_id" uuid;

alter table "public"."operation" disable row level security;

alter table "public"."operation" add constraint "operation_satellite_schedule_id_fkey" FOREIGN KEY (satellite_schedule_id) REFERENCES satellite_schedule(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."operation" validate constraint "operation_satellite_schedule_id_fkey";


