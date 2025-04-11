import express, { Router } from 'express';
import { db } from '../../db/db';
import { eq } from 'drizzle-orm';
import { users } from '../../db/schema';
import { getUser } from '../services/basic';

const router: Router = express.Router();

console.log('[getUsers] Route file loaded');

router.get('/users', async (req, res): Promise<any> => {
    try {
        const dbUsers = await db.query.users.findMany();
        if (dbUsers[0] != null) {
            return res.status(200).send({ status: 'success', dbUsers });
        } else {
            return res.status(200).send({ status: 'success', dbUsers });
        }
    } catch (error) {
        res.status(500).send({ status: 'error', error: error });
    }
});

router.get('/user/:identifier', async (req, res): Promise<any> => {
    const identifier: string = req.params.identifier;

    if (!identifier) {
        return res.status(400).json({ error: `Please specify user guid` });
    }

    let basicUser = await getUser(identifier);

    if (!basicUser) {
        return res.status(404).json({ error: `User with this GUID not found.`});
    }

    let returning: any = { details: basicUser};

    res.json(returning);
})

export default router;