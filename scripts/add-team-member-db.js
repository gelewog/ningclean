#!/usr/bin/env node

/**
 * Script to add a new team member directly to database via Prisma
 * Usage: node scripts/add-team-member-db.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// New team member data
const newTeamMember = {
  name: 'Budi Santoso',
  position: 'Cleaning Supervisor',
  department: 'Cleaning',
  bio: 'Berpengalaman dalam bidang cleaning service selama 5 tahun. Teliti dan profesional.',
  email: 'budi.santoso@ningclean.com',
  phone: '+62 812 3456 7890',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
  isActive: true,
  order: 0,
  socialLinks: {
    facebook: 'https://facebook.com/budi.santoso',
    instagram: 'https://instagram.com/budi.santoso',
    linkedin: null,
    twitter: null
  }
};

async function addTeamMember() {
  try {
    console.log('Adding new team member to database...');
    console.log('Data:', JSON.stringify(newTeamMember, null, 2));

    const teamMember = await prisma.teamMember.create({
      data: newTeamMember
    });

    console.log('✅ Team member added successfully!');
    console.log('ID:', teamMember.id);
    console.log('Name:', teamMember.name);
    console.log('Created At:', teamMember.createdAt);
    
    return teamMember;
  } catch (error) {
    console.error('❌ Failed to add team member:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

addTeamMember();
