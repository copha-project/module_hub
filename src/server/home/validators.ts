import Joi from 'joi'

export const revealToken = Joi.object({
    id: Joi.string().required()
})