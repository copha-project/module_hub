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

export const updatePackageHost = Joi.object({
    id: Joi.string().trim().required(),
    protocol: Joi.string().trim(),
    host: Joi.string().trim(),
    port: Joi.number(),
    api: Joi.object({
        upload: Joi.string().trim(),
        package: Joi.string().trim()
    })
})