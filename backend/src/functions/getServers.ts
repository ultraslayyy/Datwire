import express, { Router } from 'express';
import { db } from '../../db/db';
import { eq } from 'drizzle-orm';
import { servers } from '../../db/schema';
import { getServer } from '../services/basic';

const router: Router = express.Router();

router.get('/servers', async (req, res): Promise<any> => {
    try {
        const dbServers = await db.query.servers.findMany();
        if (dbServers[0] != null) {
            return res.status(200).send({ status: 'success', dbServers});
        } else {
            return res.status(200).send({ status: 'success', dbServers});
        }
    } catch (error) {
        res.status(200).send({ status: 'error', error: error });
    }
});

router.get('/server/:identifier', async (req, res): Promise<any> => {
    const identifier: string = req.params.identifier.split('?')[0];

    if (!identifier) {
        return res.status(400).json({ error: `Please specify server guid`});
    }

    let server: any;
    let basicServer = await getServer(identifier);

    if (!basicServer) {
        return res.status(404).json({ error: `Tournament with this GUID not found.` });
    }

    let returning: any = {};

    if (req.query.categories == 'true') {
        returning = { ...returning, categories: true }
    }

    if (req.query.channels == 'true') {
        returning = { ...returning, channels: true }
    }

    if (req.query.members == 'true') {
        returning = { ...returning, members: true }
    }

    if (req.query.roles == 'true') {
        returning = { ...returning, roles: true }
    }

    if (req.query.emojis == 'true') {
        returning = { ...returning, emojis: true }
    }

    if (req.query.messages == 'true') {
        returning = { ...returning, messages: true }
    }

    server = await db.query.servers.findFirst({
        where: eq(servers.guid, basicServer.guid),
        with: returning
    });

    res.json(server);
})

export default router;