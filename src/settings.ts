import {getExisting} from './utils/assertions';
import {getPasswordHash} from './utils/getPasswordHash';

export const PASSWORD = getExisting(process.env.PASSWORD, 'There is no PASSWORD in .env');
export const IMAGES_PATH = getExisting(process.env.IMAGES_PATH, 'There is no IMAGES_PATH in .env');
export const CLIENT_URL = getExisting(process.env.CLIENT_URL, 'There is no CLIENT_URL in .env');
export const PASSWORD_HASH = getPasswordHash(PASSWORD);

/** 1 hour */
export const SESSION_TTL = 60 * 60 * 1000;
