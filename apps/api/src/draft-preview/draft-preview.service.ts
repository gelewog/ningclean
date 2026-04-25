import { Injectable } from '@nestjs/common';

export interface DraftData {
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  author: string;
  tags: string[];
  readTime: number;
  createdAt: string;
  slug: string;
  category?: { id: string; name: string; slug: string };
}

interface StoredDraft {
  data: DraftData;
  expiresAt: number;
}

@Injectable()
export class DraftPreviewService {
  // In-memory storage (resets on server restart)
  // For production, consider Redis or database
  private drafts = new Map<string, StoredDraft>();

  // Clean up expired drafts every 5 minutes
  constructor() {
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  createDraft(data: DraftData): string {
    // Generate random ID
    const id = this.generateId();
    const expiresAt = Date.now() + 30 * 60 * 1000; // 30 minutes expiry
    
    this.drafts.set(id, { data, expiresAt });
    return id;
  }

  getDraft(id: string): DraftData | null {
    const stored = this.drafts.get(id);
    
    if (!stored) {
      return null;
    }

    // Check if expired
    if (Date.now() > stored.expiresAt) {
      this.drafts.delete(id);
      return null;
    }

    return stored.data;
  }

  deleteDraft(id: string): boolean {
    return this.drafts.delete(id);
  }

  private generateId(): string {
    // Generate URL-safe random ID
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [id, stored] of this.drafts.entries()) {
      if (now > stored.expiresAt) {
        this.drafts.delete(id);
      }
    }
  }
}
