import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import * as bcrypt from 'bcryptjs';
import { Role } from '../common';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: Role;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private auditService: AuditService,
  ) {}

  async register(data: {
    email: string;
    name: string;
    phone?: string;
    password: string;
  }): Promise<AuthResponse> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        phone: data.phone,
        password: hashedPassword,
        role: Role.CUSTOMER,
      },
    });

    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role as Role };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as Role,
      },
    };
  }

  async login(email: string, password: string): Promise<AuthResponse | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    // Audit log for successful login
    await this.auditService.log({
      action: 'LOGIN',
      entityType: 'User',
      entityId: user.id,
      userId: user.id,
      userEmail: user.email,
      changes: { email: user.email, role: user.role },
    });

    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role as Role };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as Role,
      },
    };
  }

  async validateUser(payload: JwtPayload) {
    return this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        avatar: true,
        createdAt: true,
      },
    });
    if (!user) {
      return null;
    }
    return user;
  }

  async updateProfile(userId: string, data: { name?: string; email?: string; phone?: string; avatar?: string }) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Check if email is being changed and if it's already taken
    if (data.email && data.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email },
      });
      if (existingUser) {
        return { success: false, message: 'Email already in use' };
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name ?? user.name,
        email: data.email ?? user.email,
        phone: data.phone !== undefined ? data.phone : user.phone,
        avatar: data.avatar !== undefined ? data.avatar : user.avatar,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        avatar: true,
        createdAt: true,
      },
    });

    await this.auditService.log({
      action: 'UPDATE',
      entityType: 'User',
      entityId: userId,
      userId: userId,
      userEmail: user.email,
      changes: { name: data.name, email: data.email, phone: data.phone, avatar: data.avatar },
    });

    return { success: true, message: 'Profile updated successfully', data: updatedUser };
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return { success: false, message: 'Current password is incorrect' };
    }

    if (newPassword.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters' };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    await this.auditService.log({
      action: 'PASSWORD_CHANGE',
      entityType: 'User',
      entityId: userId,
      userId: userId,
      userEmail: user.email,
      changes: { passwordChanged: true },
    });

    return { success: true, message: 'Password changed successfully' };
  }
}
