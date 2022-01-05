import { Context } from 'koa'
import { PermissionError } from '../../class/error';
import { IMiddleware } from 'koa-router'
import Utils from 'uni-utils'

export function moduleAuthorization(): IMiddleware {
  return async (ctx: Context, next: Callback) => {
    const tokenCode = ctx.headers.authorization || ctx.request.body.authorization
    if(!tokenCode) throw new PermissionError()  
    const [moduleIdHex, token] = tokenCode?.split(':')
    if(!moduleIdHex || !token || Utils.hash.sha1(ctx.appConfig.key.AppKey + moduleIdHex + ctx.appConfig.key.AppSecret) !== token){
      throw new PermissionError()
    }
    ctx.state.moduleId = Buffer.from(moduleIdHex,'hex').toString()
    await next()
  }
}

export function adminAuthorization(): IMiddleware {
  return async (ctx: Context, next: Callback) => {
    if (ctx.headers.authorization !== ctx.appConfig.key.AppSecret) {
      throw new PermissionError();
    }
    await next()
  }
}