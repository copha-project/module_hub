import { Context } from 'koa'
import Base from '../../class/base'

export async function reqLog(ctx: Context, next: Callback){
    const start = Date.now()
    await next()
    const ms = Date.now() - start
    Base.log.info(`${ctx.method} ${ctx.url} ${ctx.status} - ${ms} ms`)
}

export async function errHandler(ctx: Context, next: Callback){
    try {
        await next()
    } catch (e) {
        ctx.status = 500
        ctx.body = "500 service not work"
    }
}
