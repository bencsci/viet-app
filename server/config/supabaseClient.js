import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseClient = async (supabaseToken) => {
  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: { Authrization: `Bearer ${supabaseToken}` },
    },
  });
  return supabase;
};
