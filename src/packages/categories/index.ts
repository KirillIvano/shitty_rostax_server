import type {PrismaClient} from '@prisma/client';
import type {FastifyInstance} from 'fastify';

import {createAuthMiddleware} from '~/middleware/auth';
import {parseNumber} from '~/utils/assertions';

import type {CategoryCreateDto} from './dto';
import {validateCategoryCreateDto} from './validators';

export type CategoryIdParams = {categoryid: string};

export const generateAuthorizedCategoriesRoutes = (app: FastifyInstance, db: PrismaClient): void => {
    app.register(async localApp => {
        const auth = createAuthMiddleware(db);
        localApp.addHook('preValidation', auth);

        app.delete<{Params: CategoryIdParams}>('/category/:categoryid', async req => {
            const {categoryid} = req.params;
            const parsedId = parseNumber(categoryid, 'Id категории невалиден');

            await db.category.delete({where: {id: parsedId}});

            return {data: {ok: true}};
        });

        app.post<{Body: CategoryCreateDto}>('/category', async req => {
            const validated = validateCategoryCreateDto(req.body);

            const category = await db.category.create({data: validated});

            return {data: {category}};
        });

        app.post<{Params: CategoryIdParams; Body: CategoryCreateDto}>('/category/:categoryid', async req => {
            const {categoryid} = req.params;
            const parsedId = parseNumber(categoryid, 'Id категории невалиден');
            const validated = validateCategoryCreateDto(req.body);

            await db.category.update({data: validated, where: {id: parsedId}});

            return {data: {ok: true}};
        });
    });
};

export const generateCategoriesRoutes = (app: FastifyInstance, db: PrismaClient): void => {
    app.get('/category/all', async () => {
        const categories = await db.category.findMany();

        return {data: {categories}};
    });

    app.get<{Params: CategoryIdParams}>('/category/:categoryid', async req => {
        const {categoryid} = req.params;
        const parsedId = parseNumber(categoryid, 'Id категории невалиден');

        const category = await db.category.findUnique({where: {id: parsedId}});

        return {data: {category}};
    });
};
