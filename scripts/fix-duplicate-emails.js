#!/usr/bin/env node

/**
 * Script to fix duplicate emails in team_members table
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixDuplicateEmails() {
  try {
    console.log('Checking for duplicate emails...');
    
    // Find all team members with emails
    const teamMembers = await prisma.teamMember.findMany({
      where: { email: { not: null } },
      orderBy: { createdAt: 'asc' }
    });
    
    const emailMap = new Map();
    const duplicates = [];
    
    for (const member of teamMembers) {
      const email = member.email.toLowerCase();
      if (emailMap.has(email)) {
        duplicates.push(member);
      } else {
        emailMap.set(email, member);
      }
    }
    
    if (duplicates.length === 0) {
      console.log('✅ No duplicate emails found');
      return;
    }
    
    console.log(`Found ${duplicates.length} duplicate(s):`);
    for (const dup of duplicates) {
      console.log(`  - ${dup.name} (${dup.email}) - Created: ${dup.createdAt}`);
    }
    
    // Delete duplicates (keep the first one)
    console.log('\nDeleting duplicates...');
    for (const dup of duplicates) {
      await prisma.teamMember.delete({ where: { id: dup.id } });
      console.log(`  Deleted: ${dup.name} (${dup.email})`);
    }
    
    console.log('\n✅ Duplicates removed successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixDuplicateEmails();
