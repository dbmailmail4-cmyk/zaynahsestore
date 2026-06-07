const { Client } = require('pg');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config({ path: '/Users/shoaib/Desktop/Zaynahs e-store/.env.local' });

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('No database connection string found');
  process.exit(1);
}

async function run() {
  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const sql = `ALTER TABLE customers ALTER COLUMN password_hash DROP NOT NULL;`;
    console.log('Executing:', sql);
    await client.query(sql);
    console.log('Migration applied successfully!');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
