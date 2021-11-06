import Joi from 'joi';

import {AssertionError} from '~/errors/AssertionError';

import {ProductCreateDto, ProductUpdateDto} from './dto';

const validateProductCreateSchema = Joi.object({
    name: Joi.string().required(),
    shortDescription: Joi.string().required(),
    image: Joi.string().required(),
    description: Joi.string().required(),
    certificate: Joi.string().required(),
    categoryId: Joi.number().required(),
    price: Joi.number().optional(),
});

export const validateProductCreateDto = (dto: ProductCreateDto): ProductCreateDto => {
    const {value, error} = validateProductCreateSchema.validate(dto);

    if (error) {
        throw new AssertionError(`Продукт не валиден:\n ${error.message}`);
    }

    return value;
};

const validateProductUpdateSchema = Joi.object({
    name: Joi.string().optional(),
    shortDescription: Joi.string().optional(),
    image: Joi.string().optional(),
    description: Joi.string().optional(),
    certificate: Joi.string().optional(),
    categoryId: Joi.number().optional(),
    price: Joi.number().optional(),
});

export const validateProductUpdateDto = (dto: ProductUpdateDto): ProductUpdateDto => {
    const {value, error} = validateProductUpdateSchema.validate(dto);

    if (error) {
        throw new AssertionError(`Продукт не валиден:\n ${error.message}`);
    }

    return value;
};
