-- Migration: Rename postalCodes to coverage in service_areas table

-- Step 1: Add new coverage column
ALTER TABLE service_areas ADD COLUMN coverage TEXT[];

-- Step 2: Copy data from postalCodes to coverage
UPDATE service_areas SET coverage = postal_codes;

-- Step 3: Set not null (since all 3 rows have data)
ALTER TABLE service_areas ALTER COLUMN coverage SET NOT NULL;

-- Step 4: Drop old column
ALTER TABLE service_areas DROP COLUMN postal_codes;
