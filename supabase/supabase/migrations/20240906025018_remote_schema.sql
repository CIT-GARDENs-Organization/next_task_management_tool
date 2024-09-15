create extension if not exists "pg_net" with schema "public" version '0.8.0';

alter table "public"."satellite_schedule" add column "country" jsonb;

CREATE TRIGGER calculate_pass_schedule_hook AFTER INSERT ON public.tle FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://dpagmoqrvsuxctppiyry.supabase.co/functions/v1/calculate-pass-schedule-webhook', 'POST', '{"Content-type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwYWdtb3FydnN1eGN0cHBpeXJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQxNzI3MTAsImV4cCI6MjAzOTc0ODcxMH0.QnqeydoooVxIU0qx3pYMNS7Yy0t32OBtqviYfszwk9w"}', '{}', '1000');


