import {PrismaClient} from '@prisma/client';
import {FastifyInstance} from 'fastify';
import {createAuthMiddleware} from '~/middleware/auth';

import {PASSWORD_HASH, SESSION_TTL} from '~/settings';
import {generateHash} from '~/utils/generateHash';
import {getPasswordHash} from '~/utils/getPasswordHash';
import {optionalPromise} from '~/utils/optional';

export const generateAuthenticatedAdminRoutes = (app: FastifyInstance, db: PrismaClient): void => {
    const authMid = createAuthMiddleware(db);
    app.addHook('preValidation', authMid);

    app.get('/ping', async (_, res) => {
        return res.status(200).send({data: 'pong'});
    });
};

export const generateAdminRoutes = (app: FastifyInstance, db: PrismaClient): void => {
    app.post<{Body: {password: string | undefined}}>('/login', async (req, res) => {
        const {password} = req.body;

        if (!password) {
            res.status(400);
            return {error: 'no password'};
        }

        if (getPasswordHash(password) === PASSWORD_HASH) {
            const hash = generateHash();

            const sessionRes = await optionalPromise(db.session.create({data: {hash}}));
            if (sessionRes.err !== null) return res.status(500).send({error: 'Ошибка при создании сессии'});

            res.status(200).setCookie('pass', `${sessionRes.val.id}_${sessionRes.val.hash}`, {
                httpOnly: true,
                maxAge: SESSION_TTL / 1000,
            });

            return {data: res.cookie};
        }

        res.status(400);
        return {error: 'invalid password'};
    });
};
