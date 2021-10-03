import {FastifyInstance} from 'fastify';
import {assertExists} from '~/utils/assertions';
import {imagesRegistry} from './registry';

export const generateImagesRoutes = (app: FastifyInstance): void => {
    app.post('/image', async (req, res) => {
        const file = await req.file().catch(() => null);

        if (!file) {
            return res.status(400).send({error: 'В запросе нет файла'});
        }

        const generatedName = await imagesRegistry.saveImage(file);

        res.status(200).send({data: {fileName: generatedName}});
    });

    app.delete<{Body: {fileName?: string}}>('/image', async (req, res) => {
        const {fileName} = req.body;
        assertExists(fileName);

        await imagesRegistry.deleteImage(fileName);

        res.status(200).send({data: {ok: true}});
    });
};
