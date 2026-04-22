import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private client: SupabaseClient | null = null;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseServiceKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      console.warn('[Supabase] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not defined, skipping Supabase init');
      console.warn('[Supabase] File uploads will be disabled.');
      return;
    }

    try {
      this.client = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });

      // Verify connection and ensure bucket exists
      await this.ensureNingCleanBucket();

      console.log('[Supabase] ✅ Connected successfully');
    } catch (error) {
      console.error('[Supabase] ❌ Initialization failed:', (error as Error).message);
      this.client = null;
    }
  }

  private async ensureNingCleanBucket() {
    if (!this.client) return;

    const bucketName = 'NingClean';
    
    // Check if bucket exists
    const { data: buckets, error: listError } = await this.client.storage.listBuckets();
    
    if (listError) {
      console.warn('[Supabase] Failed to list buckets:', listError.message);
      return;
    }

    const bucketExists = buckets?.some(b => b.name === bucketName);

    if (!bucketExists) {
      console.warn(`[Supabase] Bucket '${bucketName}' does not exist.`);
      console.warn(`[Supabase] Please create the bucket manually in Supabase Dashboard or run:
        SQL Query:
        INSERT INTO storage.buckets (id, name, public) VALUES ('${bucketName}', '${bucketName}', true);
        `);
    } else {
      console.log(`[Supabase] ✅ Bucket '${bucketName}' found`);
    }
  }

  getClient(): SupabaseClient | null {
    return this.client;
  }

  getAuth() {
    return this.client?.auth;
  }

  getStorage() {
    return this.client?.storage;
  }

  from(table: string) {
    return this.client?.from(table);
  }

  isConnected(): boolean {
    return this.client !== null;
  }
}
