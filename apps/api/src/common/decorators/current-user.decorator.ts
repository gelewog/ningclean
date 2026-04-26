import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// User interface from Prisma schema (defined locally to avoid build issues)
interface PrismaUser {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  password: string;
  role: string;
  avatar?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const CurrentUser = createParamDecorator(
  (data: keyof PrismaUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
