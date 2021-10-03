import {FastifyInstance} from 'fastify';

import {PASSWORD} from '~/settings';

const passwordHash = 'k3k';

export const generateAdminRoutes = (app: FastifyInstance): void => {
    app.get('/ping', (req, res) => {
        if (req.cookies['pass'] === passwordHash) {
            res.status(200).send('pong');
            return;
        }

        res.status(401).send('error');
    });

    app.post<{Body: {password: string | undefined}}>('/login', async (req, res) => {
        const {password} = req.body;

        if (!password) {
            res.status(400);
            return {error: 'no password'};
        }

        if (password === PASSWORD) {
            res.status(200);
            res.setCookie('pass', PASSWORD, {httpOnly: true});

            return {data: 'ok'};
        }

        res.status(400);
        return {error: 'invalid password'};
    });
};
