create extension if not exists "pg_net" with schema "public" version '0.8.0';

alter table "public"."tle" add column "satellite_id" uuid;

alter table "public"."tle" add constraint "tle_satellite_id_fkey" FOREIGN KEY (satellite_id) REFERENCES satellite_list(id) ON UPDATE CASCADE not valid;

alter table "public"."tle" validate constraint "tle_satellite_id_fkey";

CREATE TRIGGER "insert-new-tle-hook" AFTER INSERT ON public.tle FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://dpagmoqrvsuxctppiyry.supabase.co/functions/v1/tle-update-webhook', 'POST', '{"Content-type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwYWdtb3FydnN1eGN0cHBpeXJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQxNzI3MTAsImV4cCI6MjAzOTc0ODcxMH0.QnqeydoooVxIU0qx3pYMNS7Yy0t32OBtqviYfszwk9w"}', '{}', '1000');


