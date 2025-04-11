import express, { Router } from 'express';
import { db } from '../../db/db';
import { eq } from 'drizzle-orm';
import { roles, messages, channels, categories, emojis, members } from '../../db/schema';
import { getServer } from '../services/basic';

const router: Router = express.Router();

router.get('/servers', async (req, res): Promise<any> => {
    try {
        const dbServers = await db.query.servers.findMany();
        if (dbServers[0] != null) {
            return res.status(200).send({ status: 'success', dbServers });
        } else {
            return res.status(200).send({ status: 'success', dbServers });
        }
    } catch (error) {
        res.status(500).send({ status: 'error', error: error });
    }
});

router.get('/server/:identifier', async (req, res): Promise<any> => {
    const identifier: string = req.params.identifier.split('?')[0];

    if (!identifier) {
        return res.status(400).json({ error: `Please specify server guid` });
    }

    let basicServer = await getServer(identifier);

    if (!basicServer) {
        return res.status(404).json({ error: `Server with this GUID not found.` });
    }

    let returning: any = { details: basicServer };

    if (req.query.categories == 'true') {
        const serverCategories = await db.query.categories.findMany({
            where: eq(categories.serverId, identifier),
        });

        returning = {...returning, categories: serverCategories};
    }

    if (req.query.channels == 'true') {
        const serverChannels = await db.query.channels.findMany({
            where: eq(channels.serverId, identifier),
        });

        returning = {...returning, channels: serverChannels};
    }

    if (req.query.members == 'true') {
        const serverMembers = await db.query.members.findMany({
            where: eq(members.serverId, identifier),
        });

        returning = {...returning, members: serverMembers};
    }

    if (req.query.roles == 'true') {
        const serverRoles = await db.query.roles.findMany({
            where: eq(roles.serverId, identifier),
        });

        returning = {...returning, roles: serverRoles};
    }

    if (req.query.emojis == 'true') {
        const serverEmojis = await db.query.emojis.findMany({
            where: eq(emojis.serverId, identifier),
        });

        returning = {...returning, emojis: serverEmojis};
    }

    if (req.query.messages == 'true') {
        const serverMessages = await db.query.messages.findMany({
            where: eq(messages.serverId, identifier),
        });

        returning = {...returning, messages: serverMessages};
    }

    res.json(returning);
})

export default router;