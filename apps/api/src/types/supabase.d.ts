// Supabase types declaration
import { SupabaseClient } from '@supabase/supabase-js';

declare module '@supabase/supabase-js' {
  interface SupabaseClient {
    auth: any;
    storage: any;
    from: (table: string) => any;
  }
}
