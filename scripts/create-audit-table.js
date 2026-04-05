const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function createTable() {
  try {
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        action VARCHAR(50) NOT NULL,
        entity_type VARCHAR(100) NOT NULL,
        entity_id VARCHAR(255) NOT NULL,
        user_id VARCHAR(255),
        user_email VARCHAR(255),
        changes JSONB,
        ip_address VARCHAR(50),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `
    console.log('Audit logs table created!')
  } catch (e) {
    if (e.message.includes('already exists')) {
      console.log('Table already exists')
    } else {
      console.log('Table creation error:', e.message)
    }
  }
  
  // Insert sample audit logs
  try {
    await prisma.$executeRaw`
      INSERT INTO audit_logs (action, entity_type, entity_id, user_email, changes, created_at)
      VALUES 
        ('CREATE', 'Booking', 'sample-1', 'admin@ningclean.com', '{"status": "pending"}'::jsonb, NOW()),
        ('UPDATE', 'Booking', 'sample-2', 'admin@ningclean.com', '{"status": "completed"}'::jsonb, NOW()),
        ('UPDATE', 'Customer', 'sample-3', 'admin@ningclean.com', '{"isVip": true}'::jsonb, NOW())
      ON CONFLICT DO NOTHING
    `
    console.log('Sample audit logs inserted')
  } catch (e) {
    console.log('Insert error (may already exist):', e.message)
  }
  
  // Verify
  try {
    const count = await prisma.$queryRaw`SELECT COUNT(*) as cnt FROM audit_logs`
    console.log('Audit logs count:', count[0].cnt)
  } catch (e) {
    console.log('Count error:', e.message)
  }
  
  prisma.$disconnect()
}

createTable()
