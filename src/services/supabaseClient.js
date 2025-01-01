import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qracyjpajjwnbivcygkg.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyYWN5anBhamp3bmJpdmN5Z2tnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0NTcyNjcsImV4cCI6MjA0NzAzMzI2N30.ui9BpgrvBpz4aq_TtMEJIGiSRDrUQV6-D81KoeeRo6U";
export const supabase = createClient(supabaseUrl, supabaseKey);
