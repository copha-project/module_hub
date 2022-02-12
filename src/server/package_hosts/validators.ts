import Joi from 'joi'

export const createPackageHost = Joi.object({
    protocol: Joi.string().trim().required(),
    host: Joi.string().trim().required(),
    port: Joi.number().required(),
    api: Joi.object({
        upload: Joi.string().trim().required(),
        package: Joi.string().trim().required()
    }).required()
})