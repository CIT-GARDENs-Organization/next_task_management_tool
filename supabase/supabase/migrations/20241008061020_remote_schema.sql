create extension if not exists "pg_net" with schema "public" version '0.8.0';

revoke delete on table "public"."operation" from "anon";

revoke insert on table "public"."operation" from "anon";

revoke references on table "public"."operation" from "anon";

revoke select on table "public"."operation" from "anon";

revoke trigger on table "public"."operation" from "anon";

revoke truncate on table "public"."operation" from "anon";

revoke update on table "public"."operation" from "anon";

revoke delete on table "public"."operation" from "authenticated";

revoke insert on table "public"."operation" from "authenticated";

revoke references on table "public"."operation" from "authenticated";

revoke select on table "public"."operation" from "authenticated";

revoke trigger on table "public"."operation" from "authenticated";

revoke truncate on table "public"."operation" from "authenticated";

revoke update on table "public"."operation" from "authenticated";

revoke delete on table "public"."operation" from "service_role";

revoke insert on table "public"."operation" from "service_role";

revoke references on table "public"."operation" from "service_role";

revoke select on table "public"."operation" from "service_role";

revoke trigger on table "public"."operation" from "service_role";

revoke truncate on table "public"."operation" from "service_role";

revoke update on table "public"."operation" from "service_role";

alter table "public"."operation" drop constraint "operation_create_user_id_fkey";

alter table "public"."operation" drop constraint "operation_satellite_schedule_id_fkey";

alter table "public"."operation" drop constraint "operation_pkey";

drop index if exists "public"."operation_pkey";

drop table "public"."operation";

alter table "public"."tle" add constraint "tle_name_fkey" FOREIGN KEY (name) REFERENCES satellite_list(name) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."tle" validate constraint "tle_name_fkey";

alter table "public"."tle" add constraint "tle_norad_id_fkey" FOREIGN KEY (norad_id) REFERENCES satellite_list(norad_id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."tle" validate constraint "tle_norad_id_fkey";


