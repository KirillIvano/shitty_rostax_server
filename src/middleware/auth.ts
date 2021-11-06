import type {PrismaClient} from '@prisma/client';
import type {DoneFuncWithErrOrRes, FastifyRequest, FastifyReply} from 'fastify';
import {UnauthorizedError} from '~/errors/UnauthorizedError';
import {SESSION_TTL} from '~/settings';

export const createAuthMiddleware = (db: PrismaClient) => {
    return async (req: FastifyRequest, _: FastifyReply, done: DoneFuncWithErrOrRes): Promise<void> => {
        const {pass} = req.cookies;
        if (!pass) throw new UnauthorizedError('Unauthorized, no pass in cookies');

        const [id, hash] = pass.split('_');

        const session = await db.session.findUnique({where: {id: +id}});

        if (session === null || session.hash !== hash) throw new UnauthorizedError('Unauthorized, pass is invalid');
        if (Date.now() - session.timestamp.valueOf() > SESSION_TTL)
            throw new UnauthorizedError('Unauthorized, pass is invalid');

        done();
    };
};
