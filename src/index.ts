import 'module-alias/register';
import dotenv from 'dotenv';
dotenv.config();

import fastify from 'fastify';
import cookie from 'fastify-cookie';
import cors from 'fastify-cors';
import multipart from 'fastify-multipart';
import type {FastifyCookieOptions} from 'fastify-cookie';

import {PrismaClient} from '@prisma/client';

import {AssertionError} from './errors/AssertionError';
import {generateAdminRoutes} from './packages/admin';
import {generateImagesRoutes} from './packages/images';
import {generateProductRoutes} from './packages/products';
import {generateCategoriesRoutes} from './packages/categories';

const app = fastify({logger: true});
const client = new PrismaClient();

app.setErrorHandler((err, req, res) => {
    if (err instanceof AssertionError) {
        res.send({error: err.message}).status(400);
        return;
    }

    throw err;
});

app.register(cookie, {secret: 'secret'} as FastifyCookieOptions);
app.register(cors);
app.register(multipart);

generateAdminRoutes(app);
generateImagesRoutes(app);
generateProductRoutes(app, client);
generateCategoriesRoutes(app, client);

app.listen(3000, '0.0.0.0');
