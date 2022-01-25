import Joi from 'joi'

export const createModule = Joi.object({
    name: Joi.string().trim().required(),
    desc: Joi.string().required(),
    type: Joi.string().required(),
    repository: Joi.string().required()
})

export const updateModule = Joi.object({
    desc: Joi.string().required(),
    repository: Joi.string().required()
})

export const revealToken = Joi.object({
    id: Joi.string().required()
})