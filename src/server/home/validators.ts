import Joi from 'joi'

export const revealToken = Joi.object({
    id: Joi.string().guid().required()
})

export const updateId = Joi.object({
    id: Joi.string().guid().required(),
    replace_id: Joi.string().guid().required()
})

export const upload = Joi.object({
    version: Joi.string().required()
})