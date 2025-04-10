import { eq } from 'drizzle-orm';
import { db } from '../../db/db';
import { servers, users } from '../../db/schema';

function isValidUUID(identifier: string): boolean {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return regex.test(identifier);
}

export async function getServer(identifier: string) {
    if (identifier == undefined) {
        throw new Error(`Cannot find server with undefined identifier! Just define it for God's sake`);
    }

    let server = await db.query.servers.findFirst({
        where: eq(servers.guid, identifier),
    });

    if (!server) {
        throw new Error(`No server found the identifier: ${identifier}`);
    }

    return server;
}

export async function getUser(identifier: string) {
    if (identifier == undefined) {
        throw new Error(`Cannot find user with undefined identifier! Just define it for God's sake`);
    }

    let user = await db.query.users.findFirst({
        where: eq(users.guid, identifier),
    });

    if (!user) {
        throw new Error(`No user found the identifier: ${identifier}`);
    }

    return user;
}