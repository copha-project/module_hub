import Joi from 'joi'

export const createModule = Joi.object({
    name: Joi.string().trim().required(),
    desc: Joi.string().required(),
    type: Joi.string().required(),
    repository: Joi.string().required()
})

export const createModulePackage = Joi.object({
    version: Joi.string().trim().required(),
    link: Joi.string().required(),
    md5: Joi.string().required(),
    sha256: Joi.string().required()
})

export const updateModule = Joi.object({
    desc: Joi.string().required(),
    repository: Joi.string().required()
})