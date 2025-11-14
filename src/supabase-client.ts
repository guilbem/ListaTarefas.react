import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://fuhuchrqkusdqucdsnuu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1aHVjaHJxa3VzZHF1Y2RzbnV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NTY5NTIsImV4cCI6MjA3NzUzMjk1Mn0.GzEu6dUWW2N7lGXJ1Jc0BQmq9klSKVZFDy8b8nhsE9A";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
