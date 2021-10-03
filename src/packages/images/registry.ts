import path from 'path';
import {randomBytes} from 'crypto';
import {readdir, writeFile, unlink} from 'fs/promises';
import type {MultipartFile} from 'fastify-multipart';

import {IMAGES_PATH} from '~/settings';

export class ImageRegistryError extends Error {}

export class ImagesRegistry {
    constructor(public imagesPath: string) {}

    saveImage = async (file: MultipartFile): Promise<string> => {
        const {filename: initialName} = file;
        const files = await readdir(this.imagesPath);

        let name: string;
        do {
            name = randomBytes(16).toString('hex');
        } while (files.includes(name));

        const extension = path.extname(initialName);
        const fullName = `${name}${extension}`;

        const fileBuffer = await file.toBuffer();

        await writeFile(path.join(this.imagesPath, fullName), fileBuffer);

        return fullName;
    };

    deleteImage = async (fileName: string): Promise<void> => {
        const files = await readdir(this.imagesPath);

        if (!files.includes(fileName)) {
            throw new ImageRegistryError('Такой фотографии нет');
        }

        await unlink(path.join(IMAGES_PATH, fileName));
    };
}

export const imagesRegistry = new ImagesRegistry(IMAGES_PATH);
