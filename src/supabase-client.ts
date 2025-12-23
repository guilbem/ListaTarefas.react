import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "Inserir URL";
const SUPABASE_ANON_KEY = "Inserir chave da API";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
