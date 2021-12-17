import { Context } from 'koa'
import { IMiddleware } from 'koa-router'
import Joi, { ValidationResult } from 'joi'
import { FieldValidationError } from '../../class/error'

export function validate(validtor: Joi.Schema): IMiddleware {
    return async (ctx: Context, next: Callback) => {
      const valResult: ValidationResult = validtor.validate(ctx.request.body, {
        allowUnknown: false,
        abortEarly: false
      })
     
      if (valResult.error) {
        throw new FieldValidationError(
          valResult.error.message,
          valResult.error.details.map(f => ({
            message: f.message,
            path: f.path,
            type: f.type
          })),
          valResult.error
        )
      }
      await next()
    }
  }