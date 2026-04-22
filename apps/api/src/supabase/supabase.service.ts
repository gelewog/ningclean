import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private client: SupabaseClient | null = null;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseServiceKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      console.warn('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not defined, skipping Supabase init');
      return;
    }

    this.client = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  getClient(): SupabaseClient | null {
    return this.client;
  }

  // @ts-ignore - Supabase auth type issue
  getAuth() {
    return this.client?.auth;
  }

  // @ts-ignore - Supabase storage type issue
  getStorage() {
    return this.client?.storage;
  }

  // @ts-ignore - Supabase from type issue
  from(table: string) {
    return this.client?.from(table);
  }
}
