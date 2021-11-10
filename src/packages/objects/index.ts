import type {PrismaClient} from '@prisma/client';
import type {FastifyInstance} from 'fastify';

import {createAuthMiddleware} from '~/middleware/auth';
import {parseNumber} from '~/utils/assertions';

import type {ObjectCreateDto} from './dto';
import {validateObjectCreateDto, validateObjectEditDto} from './validators';

export type ObjectIdParams = {objectid: string};

export const generateAuthorizedObjectsRoutes = (app: FastifyInstance, db: PrismaClient): void => {
    app.register(async localApp => {
        const auth = createAuthMiddleware(db);
        localApp.addHook('preValidation', auth);

        localApp.delete<{Params: ObjectIdParams}>('/object/:objectid', async req => {
            const {objectid} = req.params;
            const parsedId = parseNumber(objectid, 'Id объекта невалиден');

            await db.object.delete({where: {id: parsedId}});

            return {data: {ok: true}};
        });

        localApp.post<{Body: ObjectCreateDto}>('/object', async req => {
            const validated = validateObjectCreateDto(req.body);

            const object = await db.object.create({data: validated});

            return {data: {object}};
        });

        localApp.post<{Params: ObjectIdParams; Body: ObjectCreateDto}>('/object/:objectid', async req => {
            const {objectid} = req.params;
            const parsedId = parseNumber(objectid, 'Id объекта невалиден');
            const validated = validateObjectEditDto(req.body);

            await db.object.update({data: validated, where: {id: parsedId}});

            return {data: {ok: true}};
        });
    });
};

export const generateObjectsRoutes = (app: FastifyInstance, db: PrismaClient): void => {
    app.get('/object/all', async () => {
        const objects = await db.object.findMany();

        return {data: {objects}};
    });

    app.get<{Params: ObjectIdParams}>('/object/:objectid', async req => {
        const {objectid} = req.params;
        const parsedId = parseNumber(objectid, 'Id объекта невалиден');

        const object = await db.object.findUnique({where: {id: parsedId}});

        return {data: {object}};
    });
};
