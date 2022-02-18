import { Context } from 'koa'
import { AppError } from '../class/error'

export async function reqLog(ctx: Context, next: Callback) {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.log.info(`${ctx.method} ${ctx.url} ${ctx.status} - ${ms} ms`)
}

export async function reply(ctx: Context, next: Callback) {
  await next()
  if(ctx._matchedRoute === '/') return
  if(ctx.status.toString() !== '200'){
    ctx.body = {
      code: ctx.status,
      msg: ctx.body || '',
      data: ''
    }
  }else{
    ctx.body = {
      code: 200,
      msg: '',
      data: ctx.body || ''
    }
  }
  ctx.status = 200
}

export async function catchError(ctx: Context, next: Callback){
  try {
    await next()
  } catch (err) {
    ctx.log.err(`Error Handler: ${err}, ${err instanceof AppError}`)
    if (err instanceof AppError) {
      ctx.body = err.message
      ctx.status = err.code
    } else {
      ctx.body = (err as Error)?.message || 'Internal Error Server'
      ctx.status = 500
    }
  }
}