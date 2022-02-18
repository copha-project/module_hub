import Joi from 'joi'

const stringRule = Joi.string().trim()
const urlRule = Joi.string().trim().regex(/^\//)

export const createPackageHost = Joi.object({
    protocol: stringRule.required(),
    host: stringRule.required(),
    port: Joi.number().required(),
    api: Joi.object({
        upload: urlRule,
        package: urlRule
    }).required()
})

export const updatePackageHost = Joi.object({
    protocol: stringRule,
    host: stringRule,
    port: Joi.number(),
    api: Joi.object({
        upload: urlRule,
        package: urlRule
    })
})