import Joi from 'joi'

export const createPackageHost = Joi.object({
    host: Joi.string().trim().required(),
    port: Joi.number().required()
})