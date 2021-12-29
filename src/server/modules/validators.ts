import Joi from 'joi'

export const createModule = Joi.object({
    name: Joi.string().trim().required(),
    desc: Joi.string().required(),
    repository: Joi.string().required()
})

export const updateModule: Joi.SchemaMap = {
  desc: Joi.string().required()
}