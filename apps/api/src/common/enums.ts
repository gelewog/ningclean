/**
 * Local enums that mirror Prisma schema enums
 * This ensures enums are always available without depending on Prisma Client generation
 */

export enum Role {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  ISSUED = 'ISSUED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

export enum NotificationType {
  BOOKING_NEW = 'BOOKING_NEW',
  BOOKING_STATUS = 'BOOKING_STATUS',
  SYSTEM = 'SYSTEM',
}

export enum TemplateType {
  BOOKING_CONFIRMED = 'BOOKING_CONFIRMED',
  BOOKING_STATUS_UPDATED = 'BOOKING_STATUS_UPDATED',
  BOOKING_REMINDER = 'BOOKING_REMINDER',
  BOOKING_CANCELLED = 'BOOKING_CANCELLED',
  CUSTOMER_WELCOME = 'CUSTOMER_WELCOME',
}
