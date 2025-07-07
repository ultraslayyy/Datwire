import { Client } from 'pg';
import { readFileSync } from 'fs';
import { config } from 'dotenv';

config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function applyMigration(filePath: string) {
  // Read the SQL migration file content
  const sql = readFileSync(filePath, 'utf-8');

  try {
    // Connect to the database
    await client.connect();

    // Execute the SQL
    await client.query(sql);
    console.log(`Migration applied successfully from: ${filePath}`);
  } catch (error) {
    console.error(`Error applying migration from ${filePath}:`, error);
  } finally {
    // Disconnect from the database
    await client.end();
  }
}

// Provide the path to the migration file
applyMigration('./migrations/0000_early_tombstone.sql');