#!/usr/bin/env node

/**
 * Script to add a new team member via API
 * Usage: node scripts/add-team-member.js
 */

const API_URL = process.env.API_URL || 'http://localhost:4000';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';

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
    linkedin: '',
    twitter: ''
  }
};

async function addTeamMember() {
  try {
    console.log('Adding new team member...');
    console.log('Data:', JSON.stringify(newTeamMember, null, 2));
    console.log('API URL:', API_URL);

    const headers = {
      'Content-Type': 'application/json',
    };

    if (ADMIN_TOKEN) {
      headers['Authorization'] = `Bearer ${ADMIN_TOKEN}`;
    }

    const response = await fetch(`${API_URL}/api/team-members`, {
      method: 'POST',
      headers,
      body: JSON.stringify(newTeamMember),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Team member added successfully!');
    console.log('Response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('❌ Failed to add team member:', error.message);
    process.exit(1);
  }
}

addTeamMember();
