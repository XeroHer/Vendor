// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://jpuvxfeqegjmaspdottb.supabase.co",
  "sb_publishable_wcE05Xcds84n2UMlKjiQ7A_0JhkpNtc"
);