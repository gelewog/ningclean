#!/usr/bin/env node

/**
 * Script to add a new team member directly to database via Prisma
 * Usage: node scripts/add-team-member-new.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// New team member data - different from previous
const newTeamMember = {
  name: 'Siti Aminah',
  position: 'Senior Cleaning Staff',
  department: 'Cleaning',
  bio: 'Ahli dalam pembersihan rumah tinggal dan apartemen dengan pengalaman 4 tahun. Ramah dan detail-oriented.',
  email: 'siti.aminah@ningclean.com',
  phone: '+62 813 8765 4321',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
  isActive: true,
  order: 1,
  socialLinks: {
    facebook: 'https://facebook.com/siti.aminah',
    instagram: 'https://instagram.com/siti.aminah',
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
    console.log('Email:', teamMember.email);
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
