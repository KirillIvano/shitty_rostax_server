import Joi from 'joi';

import {AssertionError} from '~/errors/AssertionError';

import {CategoryCreateDto, CategoryEditDto} from './dto';

const validateCategoryCreateSchema = Joi.object({
    name: Joi.string().required(),
    image: Joi.string().required(),
});

const validateCategoryEditSchema = Joi.object({
    name: Joi.string().optional(),
    image: Joi.string().optional(),
});

export const validateCategoryCreateDto = (dto: CategoryCreateDto): CategoryCreateDto => {
    const {value, error} = validateCategoryCreateSchema.validate(dto);

    if (error) {
        throw new AssertionError(`Категория не валидна:\n ${error.message}`);
    }

    return value;
};

export const validateCategoryEditDto = (dto: CategoryEditDto): CategoryEditDto => {
    const {value, error} = validateCategoryEditSchema.validate(dto);

    if (error) {
        throw new AssertionError(`Категория не валидна:\n ${error.message}`);
    }

    return value;
};
