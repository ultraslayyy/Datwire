import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

require('dotenv').config();

let { PGCONNECTIONSTRING } = process.env;

const client = postgres(PGCONNECTIONSTRING as string)
export const db = drizzle(client, { schema, logger: false });