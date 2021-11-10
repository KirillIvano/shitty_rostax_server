import Joi from 'joi';

import {AssertionError} from '~/errors/AssertionError';

import {ObjectImageCreateDto} from './dto';

const validateImageSchema = Joi.object({
    image: Joi.string().required(),
    objectId: Joi.number().required(),
});

export const validateImageCreateDto = (dto: ObjectImageCreateDto): ObjectImageCreateDto => {
    const {value, error} = validateImageSchema.validate(dto);

    if (error) {
        throw new AssertionError(`Картинка не валидна:\n ${error.message}`);
    }

    return value;
};
