create extension if not exists "pg_net" with schema "public" version '0.8.0';

alter table "public"."parsed_tle" drop column "norad_id";

CREATE UNIQUE INDEX satellite_list_norad_id_key ON public.satellite_list USING btree (norad_id);

alter table "public"."parsed_tle" add constraint "parsed_tle_name_fkey" FOREIGN KEY (name) REFERENCES satellite_list(name) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."parsed_tle" validate constraint "parsed_tle_name_fkey";

alter table "public"."parsed_tle" add constraint "parsed_tle_satellite_id_fkey" FOREIGN KEY (satellite_id) REFERENCES satellite_list(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."parsed_tle" validate constraint "parsed_tle_satellite_id_fkey";

alter table "public"."satellite_list" add constraint "satellite_list_norad_id_key" UNIQUE using index "satellite_list_norad_id_key";


