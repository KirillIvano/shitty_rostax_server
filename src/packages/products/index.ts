import {PrismaClient} from '@prisma/client';
import type {FastifyInstance} from 'fastify';

import {parseNumber} from '~/utils/assertions';

import {ProductCreateDto} from './dto';
import {validateProductCreateDto} from './validators';

export type ProductIdParams = {productId: string};

export const generateProductRoutes = (app: FastifyInstance, db: PrismaClient): void => {
    app.get('/product/all', async () => {
        const products = await db.product.findMany();

        return {data: {products}};
    });

    app.get<{Params: ProductIdParams}>('/product/:productId', async req => {
        const {productId} = req.params;
        const parsedId = parseNumber(productId, 'Id продукта невалиден');

        const product = await db.product.findUnique({where: {id: parsedId}});

        return {data: {product}};
    });

    app.delete<{Params: ProductIdParams}>('/product/:productId', async req => {
        const {productId} = req.params;
        const parsedId = parseNumber(productId, 'Id продукта невалиден');

        await db.product.delete({where: {id: parsedId}});

        return {data: {ok: true}};
    });

    app.post<{Body: ProductCreateDto}>('/product', async req => {
        const validated = validateProductCreateDto(req.body);

        const product = await db.product.create({data: validated});

        return {data: {product}};
    });
};
