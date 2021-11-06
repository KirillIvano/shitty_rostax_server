import crypto from 'crypto';

export const getPasswordHash = (pass: string): string => crypto.createHash('md5').update(pass).digest('hex');
