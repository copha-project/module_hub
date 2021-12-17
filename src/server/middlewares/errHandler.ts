import { Context } from 'koa'
import { AppError } from '../../class/error'
import Base from '../../class/base'

const httpCodes: {
  [index:number]: number
 } = {
  10000: 500,
  20000: 404,
  30000: 400,
  30001: 400,
  30002: 401,
  30003: 403
}

export async function errorHandler(ctx: Context, next: Callback){
  try {
    await next()
  } catch (err) {
    Base.log.err(`Error Handler: ${err}`)
    if (err instanceof AppError) {
      ctx.body = err.toModel()
      ctx.status = httpCodes[err.code] ? httpCodes[err.code] : 500
    } else {
      ctx.body = new AppError(10000, 'Internal Error Server')
      ctx.status = 500
    }
  }
}