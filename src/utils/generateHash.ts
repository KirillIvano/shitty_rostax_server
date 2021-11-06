import {randomBytes} from 'crypto';

export const generateHash = (): string => randomBytes(16).toString('hex');
