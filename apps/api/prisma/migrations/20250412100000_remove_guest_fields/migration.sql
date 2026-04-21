-- Migration: Remove guest fields from Booking table and migrate data to Customer
-- This migration should be run in order:
-- 1. Create customers from guest data
-- 2. Update bookings to link to customers
-- 3. Remove guest columns

-- Step 1: Create customers from unique guest emails in bookings
INSERT INTO "customers" (id, name, email, phone, "source", "isVip", addresses, "createdAt", "updatedAt")
SELECT 
    gen_random_uuid() as id,
    b."guestName" as name,
    LOWER(TRIM(b."guestEmail")) as email,
    b."guestPhone" as phone,
    'guest' as "source",
    false as "isVip",
    '[]' as addresses,
    NOW() as "createdAt",
    NOW() as "updatedAt"
FROM (
    SELECT DISTINCT ON (LOWER(TRIM("guestEmail"))) 
        "guestName",
        "guestEmail",
        "guestPhone"
    FROM "bookings"
    WHERE "guestEmail" IS NOT NULL
    ORDER BY LOWER(TRIM("guestEmail")), "createdAt" ASC
) b
WHERE NOT EXISTS (
    SELECT 1 FROM "customers" c WHERE LOWER(c.email) = LOWER(TRIM(b."guestEmail"))
);

-- Step 2: Update bookings to link to the newly created customers
UPDATE "bookings" b
SET "customerId" = c.id
FROM "customers" c
WHERE LOWER(TRIM(b."guestEmail")) = LOWER(c.email)
AND b."customerId" IS NULL;

-- Step 3: Create generic customers for any remaining bookings without customerId
-- (Edge case handling)
DO $$
DECLARE
    booking_record RECORD;
    new_customer_id UUID;
BEGIN
    FOR booking_record IN 
        SELECT id, "guestName", "guestEmail", "guestPhone"
        FROM "bookings"
        WHERE "customerId" IS NULL
    LOOP
        -- Create generic customer
        INSERT INTO "customers" (id, name, email, phone, "source", "isVip", addresses, "createdAt", "updatedAt")
        VALUES (
            gen_random_uuid(),
            COALESCE(booking_record."guestName", 'Unknown Customer'),
            COALESCE(LOWER(TRIM(booking_record."guestEmail")), 'unknown-' || booking_record.id || '@temp.com'),
            booking_record."guestPhone",
            'guest',
            false,
            '[]',
            NOW(),
            NOW()
        )
        RETURNING id INTO new_customer_id;
        
        -- Update booking with new customer ID
        UPDATE "bookings" SET "customerId" = new_customer_id WHERE id = booking_record.id;
    END LOOP;
END $$;

-- Step 4: Verify all bookings have customerId before making it NOT NULL
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "bookings" WHERE "customerId" IS NULL) THEN
        RAISE EXCEPTION 'There are still bookings without customerId. Migration cannot proceed.';
    END IF;
END $$;

-- Step 5: Remove guest columns from bookings table
ALTER TABLE "bookings" DROP COLUMN IF EXISTS "guestName";
ALTER TABLE "bookings" DROP COLUMN IF EXISTS "guestEmail";
ALTER TABLE "bookings" DROP COLUMN IF EXISTS "guestPhone";

-- Step 6: Add NOT NULL constraint to customerId (optional - uncomment if needed)
-- ALTER TABLE "bookings" ALTER COLUMN "customerId" SET NOT NULL;

-- Step 7: Add index for faster lookups
CREATE INDEX IF NOT EXISTS "idx_bookings_customerId" ON "bookings"("customerId");