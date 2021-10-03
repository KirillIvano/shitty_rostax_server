import Joi from 'joi';

import {AssertionError} from '~/errors/AssertionError';

import {ProductCreateDto} from './dto';

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
