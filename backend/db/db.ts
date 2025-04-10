import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

require('dotenv').config();

let { DATABASE_URL } = process.env;

const client = postgres(DATABASE_URL as string)
export const db = drizzle(client, { schema, logger: false });