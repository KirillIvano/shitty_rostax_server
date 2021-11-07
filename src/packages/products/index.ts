import {PrismaClient} from '@prisma/client';
import type {FastifyInstance} from 'fastify';
import {createAuthMiddleware} from '~/middleware/auth';

import {parseNumber} from '~/utils/assertions';

import {ProductCreateDto, ProductUpdateDto} from './dto';
import {validateProductCreateDto, validateProductUpdateDto} from './validators';

export type ProductIdParams = {productId: string};

export const generateAuthorizedProductRoutes = (app: FastifyInstance, db: PrismaClient): void => {
    app.register(async localApp => {
        const auth = createAuthMiddleware(db);
        localApp.addHook('preValidation', auth);

        localApp.delete<{Params: ProductIdParams}>('/product/:productId', async req => {
            const {productId} = req.params;
            const parsedId = parseNumber(productId, 'Id продукта невалиден');

            await db.product.delete({where: {id: parsedId}});

            return {data: {ok: true}};
        });

        localApp.post<{Body: ProductCreateDto}>('/product', async req => {
            const validated = validateProductCreateDto(req.body);

            const product = await db.product.create({data: validated});

            return {data: {product}};
        });

        localApp.put<{Body: ProductUpdateDto; Params: {productId: string}}>('/product/:productId', async (req, res) => {
            const {productId} = req.params;
            const parsedId = parseNumber(productId, 'Id продукта невалиден');

            const product = await db.product.findUnique({where: {id: parsedId}});
            if (product === null) {
                return res.status(404);
            }

            const {categoryId, image, certificate} = product;
            req.body.categoryId = categoryId;

            if (!req.body.image) req.body.image = image;
            if (!req.body.certificate) req.body.certificate = certificate;

            const validated = validateProductUpdateDto(req.body);

            const updatedProduct = await db.product.update({data: validated, where: {id: parsedId}});

            return {data: {product: updatedProduct}};
        });
    });
};

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
};
