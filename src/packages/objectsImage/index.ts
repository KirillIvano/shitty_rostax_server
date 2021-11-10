import type {PrismaClient} from '@prisma/client';
import type {FastifyInstance} from 'fastify';

import {createAuthMiddleware} from '~/middleware/auth';
import {parseNumber} from '~/utils/assertions';

import type {ObjectImageCreateDto} from './dto';
import {validateImageCreateDto} from './validators';

export type ImageIdParams = {imageid: string};

export const generateAuthorizedObjectImagesRoutes = (app: FastifyInstance, db: PrismaClient): void => {
    app.register(async localApp => {
        const auth = createAuthMiddleware(db);
        localApp.addHook('preValidation', auth);

        localApp.delete<{Params: ImageIdParams}>('/objectImages/:imageid', async req => {
            const {imageid} = req.params;
            const parsedId = parseNumber(imageid, 'Id картинки невалиден');

            await db.objectImage.delete({where: {id: parsedId}});

            return {data: {ok: true}};
        });

        localApp.post<{Body: ObjectImageCreateDto}>('/objectImages', async req => {
            const validated = validateImageCreateDto(req.body);

            const objectImage = await db.objectImage.create({data: validated});

            return {data: {objectImage}};
        });
    });
};

export const generateObjectImagesRoutes = (app: FastifyInstance, db: PrismaClient): void => {
    app.get('/objectImages/all', async () => {
        const objectImages = await db.objectImage.findMany();

        return {data: {objectImages}};
    });

    app.get<{Params: ImageIdParams}>('/objectImages/:imageid', async req => {
        const {imageid} = req.params;
        const parsedId = parseNumber(imageid, 'Id картинки невалиден');

        const objectImage = await db.objectImage.findUnique({where: {id: parsedId}});

        return {data: {objectImage}};
    });
};
