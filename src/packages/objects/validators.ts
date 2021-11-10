import Joi from 'joi';

import {AssertionError} from '~/errors/AssertionError';

import {ObjectCreateDto} from './dto';

const validateObjectSchema = Joi.object({
    name: Joi.string().required(),
});

export const validateObjectCreateDto = (dto: ObjectCreateDto): ObjectCreateDto => {
    const {value, error} = validateObjectSchema.validate(dto);

    if (error) {
        throw new AssertionError(`Объект не валиден:\n ${error.message}`);
    }

    return value;
};

export const validateObjectEditDto = (dto: ObjectCreateDto): ObjectCreateDto => {
    const {value, error} = validateObjectSchema.validate(dto);

    if (error) {
        throw new AssertionError(`Объект не валиден:\n ${error.message}`);
    }

    return value;
};
