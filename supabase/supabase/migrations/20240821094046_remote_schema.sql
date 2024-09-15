create extension if not exists "pg_net" with schema "public" version '0.8.0';

alter table "public"."satellite_list" enable row level security;

alter table "public"."tle" enable row level security;

create policy "Enable read access for all users"
on "public"."satellite_list"
as permissive
for select
to public
using (true);


create policy "Enable insert for anon only"
on "public"."tle"
as permissive
for insert
to anon
with check (true);



