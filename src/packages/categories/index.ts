import type {PrismaClient} from '@prisma/client';
import type {FastifyInstance} from 'fastify';

import {createAuthMiddleware} from '~/middleware/auth';
import {parseNumber} from '~/utils/assertions';

import type {CategoryCreateDto} from './dto';
import {validateCategoryCreateDto, validateCategoryEditDto} from './validators';

export type CategoryIdParams = {categoryid: string};

export const generateAuthorizedCategoriesRoutes = (app: FastifyInstance, db: PrismaClient): void => {
    app.register(async localApp => {
        const auth = createAuthMiddleware(db);
        localApp.addHook('preValidation', auth);

        localApp.delete<{Params: CategoryIdParams}>('/category/:categoryid', async req => {
            const {categoryid} = req.params;
            const parsedId = parseNumber(categoryid, 'Id категории невалиден');

            await db.category.delete({where: {id: parsedId}});

            return {data: {ok: true}};
        });

        localApp.post<{Body: CategoryCreateDto}>('/category', async req => {
            const validated = validateCategoryCreateDto(req.body);

            const category = await db.category.create({data: validated});

            return {data: {category}};
        });

        localApp.post<{Params: CategoryIdParams; Body: CategoryCreateDto}>(
            '/category/:categoryid',
            async (req, res) => {
                const {categoryid} = req.params;
                const parsedId = parseNumber(categoryid, 'Id категории невалиден');

                const category = await db.category.findUnique({where: {id: parsedId}});
                if (category === null) {
                    return res.status(404);
                }

                const {image} = category;
                if (!req.body.image) req.body.image = image;

                const validated = validateCategoryEditDto(req.body);

                await db.category.update({data: validated, where: {id: parsedId}});

                return {data: {ok: true}};
            },
        );
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
