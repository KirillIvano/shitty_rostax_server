import {getExisting} from './utils/assertions';

export const PASSWORD = getExisting(process.env.PASSWORD, 'Укажи PASSWORD в .env');
export const IMAGES_PATH = getExisting(process.env.IMAGES_PATH, 'Укажи IMAGES_PATH в .env');
