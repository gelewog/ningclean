import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'PASSWORD_CHANGE';

export interface AuditLogEntry {
  action: AuditAction;
  entityType: string;
  entityId: string;
  userId?: string;
  userEmail?: string;
  changes?: any;
}

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(entry: AuditLogEntry): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          action: entry.action,
          entityType: entry.entityType,
          entityId: entry.entityId,
          userId: entry.userId || null,
          userEmail: entry.userEmail || null,
          changes: entry.changes || null,
        },
      });
    } catch (error) {
      console.error('Failed to write audit log:', error);
    }
  }

  async getLogs(limit = 100): Promise<any[]> {
    return this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
