import {PrismaClient} from '@prisma/client';
import type {FastifyInstance} from 'fastify';
import {parseNumber} from '~/utils/assertions';

import {CategoryCreateDto} from './dto';
import {validateCategoryCreateDto} from './validators';

export type CategoryIdParams = {categoryid: string};

export const generateCategoriesRoutes = (app: FastifyInstance, db: PrismaClient): void => {
    app.get('/category/all', async () => {
        const categories = await db.category.findMany();

        return {data: {categories}};
    });

    app.get<{Params: CategoryIdParams}>('/category/:categoryId', async req => {
        const {categoryid} = req.params;
        const parsedId = parseNumber(categoryid, 'Id категории невалиден');

        const category = await db.category.findUnique({where: {id: parsedId}});

        return {data: {category}};
    });

    app.delete<{Params: CategoryIdParams}>('/category/:categoryId', async req => {
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
};
