import 'module-alias/register';

import fastify from 'fastify';
import cookie from 'fastify-cookie';
import path from 'path';
import cors from 'fastify-cors';
import multipart from 'fastify-multipart';
import fstatic from 'fastify-static';
import type {FastifyCookieOptions} from 'fastify-cookie';

import {PrismaClient} from '@prisma/client';

import {AssertionError} from './errors/AssertionError';
import {UnauthorizedError} from './errors/UnauthorizedError';
import {generateAdminRoutes, generateAuthenticatedAdminRoutes} from './packages/admin';
import {generateImagesRoutes} from './packages/images';
import {generateAuthorizedProductRoutes, generateProductRoutes} from './packages/products';
import {generateAuthorizedCategoriesRoutes, generateCategoriesRoutes} from './packages/categories';
import {CLIENT_URL} from '~/settings';

const app = fastify({logger: true});
const client = new PrismaClient();

app.setErrorHandler((err, req, res) => {
    if (err instanceof AssertionError) {
        res.send({error: err.message}).status(400);
        return;
    }
    if (err instanceof UnauthorizedError) {
        res.send({error: err.message}).status(401);
        return;
    }

    res.status(500).send(err);
});

app.register(fstatic, {
    root: path.resolve(__dirname, '../static'),
    prefix: '/static/',
});
app.register(cookie, {secret: 'secret'} as FastifyCookieOptions);
app.register(cors, {
    origin: CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'PUT'],
    allowedHeaders: ['Origin', 'Content-Type', 'X-Auth-Token'],
});
app.register(multipart);

generateAdminRoutes(app, client);
generateAuthenticatedAdminRoutes(app, client);
generateImagesRoutes(app, client);
generateProductRoutes(app, client);
generateAuthorizedProductRoutes(app, client);
generateCategoriesRoutes(app, client);
generateAuthorizedCategoriesRoutes(app, client);

app.listen(3000, '0.0.0.0');
