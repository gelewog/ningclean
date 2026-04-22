#!/usr/bin/env node
/**
 * Script untuk migrasi folder uploads lokal ke Supabase Storage
 * Usage: node migrate-uploads-to-supabase.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load env from apps/api/.env
require('dotenv').config({ path: path.join(__dirname, '../apps/api/.env') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY tidak ditemukan di .env');
  process.exit(1);
}

const UPLOADS_DIR = path.join(__dirname, '../apps/api/uploads');
const BUCKET_NAME = 'uploads';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// Get mime type from extension
function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

// Recursively get all files
function getAllFiles(dir, baseDir = dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      getAllFiles(fullPath, baseDir, files);
    } else {
      const relativePath = path.relative(baseDir, fullPath);
      files.push({
        localPath: fullPath,
        remotePath: relativePath.replace(/\\/g, '/'), // Normalize to forward slashes
        size: stat.size
      });
    }
  }
  
  return files;
}

// Upload file to Supabase
async function uploadFile(localPath, remotePath) {
  try {
    const fileBuffer = fs.readFileSync(localPath);
    const mimeType = getMimeType(localPath);
    
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(remotePath, fileBuffer, {
        contentType: mimeType,
        upsert: true // Overwrite if exists
      });
    
    if (error) {
      throw error;
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(remotePath);
    
    return { success: true, publicUrl };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Main migration function
async function migrate() {
  console.log('🚀 Memulai migrasi uploads ke Supabase...\n');
  
  // Check if uploads directory exists
  if (!fs.existsSync(UPLOADS_DIR)) {
    console.error(`❌ Error: Folder ${UPLOADS_DIR} tidak ditemukan`);
    process.exit(1);
  }
  
  // Get all files
  const files = getAllFiles(UPLOADS_DIR);
  console.log(`📁 Ditemukan ${files.length} file untuk diupload\n`);
  
  if (files.length === 0) {
    console.log('✅ Tidak ada file untuk diupload');
    return;
  }
  
  // Check bucket exists
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  if (bucketError) {
    console.error('❌ Error checking buckets:', bucketError.message);
    process.exit(1);
  }
  
  const bucketExists = buckets?.some(b => b.name === BUCKET_NAME);
  if (!bucketExists) {
    console.error(`❌ Error: Bucket '${BUCKET_NAME}' tidak ditemukan di Supabase`);
    console.log('💡 Hint: Buat bucket manual di Supabase Dashboard atau jalankan:');
    console.log(`   INSERT INTO storage.buckets (id, name, public) VALUES ('${BUCKET_NAME}', '${BUCKET_NAME}', true);`);
    process.exit(1);
  }
  
  console.log(`✅ Bucket '${BUCKET_NAME}' ditemukan\n`);
  
  // Upload files
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const progress = `[${i + 1}/${files.length}]`;
    
    process.stdout.write(`${progress} Uploading: ${file.remotePath} ... `);
    
    const result = await uploadFile(file.localPath, file.remotePath);
    
    if (result.success) {
      console.log(`✅`);
      successCount++;
    } else {
      console.log(`❌ ${result.error}`);
      failCount++;
    }
  }
  
  console.log(`\n📊 Hasil Migrasi:`);
  console.log(`   ✅ Sukses: ${successCount} file`);
  console.log(`   ❌ Gagal: ${failCount} file`);
  console.log(`   📁 Total: ${files.length} file`);
  
  if (failCount === 0) {
    console.log('\n🎉 Migrasi selesai! Semua file berhasil diupload.');
  } else {
    console.log('\n⚠️  Beberapa file gagal diupload. Cek log di atas.');
    process.exit(1);
  }
}

// Run migration
migrate().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
