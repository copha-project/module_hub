import { Context } from 'koa'
import { AppError } from '../../class/error'

export async function errorHandler(ctx: Context, next: Callback){
  try {
    await next()
  } catch (err) {
    ctx.log.err(`Error Handler: ${err}, ${err instanceof AppError}`)
    if (err instanceof AppError) {
      ctx.body = err.message
      ctx.status = err.code
    } else {
      ctx.body = new AppError(10000, (err as Error)?.message || 'Internal Error Server').toModel()
      ctx.status = 500
    }
  }
}