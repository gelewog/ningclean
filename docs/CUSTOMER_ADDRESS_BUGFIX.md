# Customer Address Bug Fix - Analysis

## Problem Identified

**BUG:** Guest customer `addresses` field not being populated despite booking address being saved.

### Database State Before Fix:
```
Customer Table:
- addresses: "[]" (empty JSON array)
- source: "guest"

Booking Table:
- address: "Jl. Test Booking No. 123, Surabaya" ✓
- orderNumber: "NC-2026-0002" ✓
```

## Root Cause

**Prisma ORM Type Mismatch:**

In `schema.prisma`:
```prisma
model Customer {
  addresses Json @default("[]")  // <-- This is Json type, NOT String
}
```

In `bookings.service.ts`:
```typescript
// WRONG - Passing stringified JSON
addresses: JSON.stringify([newAddress])  // Results in: ""[]""

// CORRECT - Prisma handles Json type automatically
addresses: [newAddress]  // Results in proper JSON array
```

**The Issue:** When using `JSON.stringify()`, Prisma double-encodes it:
- Input: `JSON.stringify([{address: "test"}])` → `"[{\"address\":\"test\"}]"` 
- Stored in DB as: `"[]"` (parsed incorrectly)

**Expected Behavior:**
- Input: `[{address: "test"}]`
- Stored in DB as: `[{"address": "test"}]` (proper JSON array)

## The Fix

Changed all instances in `bookings.service.ts`:
- ❌ `addresses: JSON.stringify([newAddress])`
- ✅ `addresses: [newAddress]`

Prisma automatically serializes JavaScript arrays/objects to PostgreSQL JSONB.

## Why Booking Address Works

The `booking.address` field is a **String** type (not Json), so it stores plain text directly:
```prisma
model Booking {
  address String  // Simple string - no serialization needed
}
```

## Flow Summary

### Guest Booking Flow:
1. User submits booking form with address
2. System checks if customer exists by email
3. **If NOT exists:** Create new guest customer
   - ❌ **BUG:** Was saving `addresses: "[]"` (empty)
   - ✅ **FIX:** Now saves `addresses: [{label: "Alamat Booking", address: "..."}]`
4. Create booking record with address (always worked)
5. Send notifications

### Registered User Flow:
1. User logged in → linked to User account
2. Same process, but source="registered"

## Migration (Optional)

To fix existing customers with empty addresses:

```sql
-- Find guest customers with empty addresses
SELECT id, email, addresses, source 
FROM customers 
WHERE source = 'guest' AND addresses = '"[]"';

-- Option: Populate from their latest booking address
-- (Run a migration script to copy booking.address to customer.addresses)
```

## Testing

After fix, new guest bookings should have:
```json
{
  "addresses": [
    {
      "label": "Alamat Booking",
      "address": "Jl. Test Booking No. 123, Surabaya",
      "city": "",
      "phone": "081234567890"
    }
  ]
}
```

## Benefits of Fix

1. ✅ Customer address history preserved
2. ✅ Easy re-booking with saved addresses
3. ✅ Admin can see customer locations
4. ✅ Can implement "select from saved addresses" feature
5. ✅ Better customer experience

## Files Modified

- `apps/api/src/bookings/bookings.service.ts`
  - Line ~240-280: New customer creation
  - Line ~310-320: Existing customer update
  - Line ~340-350: Anonymous customer creation
