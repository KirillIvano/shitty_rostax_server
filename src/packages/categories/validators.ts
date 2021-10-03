import Joi from 'joi';

import {AssertionError} from '~/errors/AssertionError';

import {CategoryCreateDto} from './dto';

const validateCategoryCreateSchema = Joi.object({
    name: Joi.string().required(),
    image: Joi.string().required(),
});

export const validateCategoryCreateDto = (dto: CategoryCreateDto): CategoryCreateDto => {
    const {value, error} = validateCategoryCreateSchema.validate(dto);

    if (error) {
        throw new AssertionError(`Категория не валидна:\n ${error.message}`);
    }

    return value;
};
