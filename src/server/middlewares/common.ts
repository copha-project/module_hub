import { Context } from 'koa'

export async function reqLog(ctx: Context, next: Callback) {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.log.info(`${ctx.method} ${ctx.url} ${ctx.status} - ${ms} ms`)
}

export async function reply(ctx: Context, next: Callback) {
  await next()
  if(!ctx._matchedRoute?.startsWith('/api/')) return
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