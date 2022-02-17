import { Context } from 'koa'
import { PermissionError } from '../class/error';
import { Middleware } from '@koa/router'
import { getAuthController } from '../class/auth';

export function moduleAuthorization(): Middleware {
  return async (ctx: Context, next: Callback) => {
    const token = ctx.headers.authorization || ctx.request.body.authorization
    const moduleId = ctx.params.id
    if(!token || !moduleId || !getAuthController().verifyToken(moduleId, token)){
      throw new PermissionError()
    }
    ctx.state.moduleId = moduleId
    await next()
  }
}

export function adminAuthorization(): Middleware {
  return async (ctx: Context, next: Callback) => {
    if (ctx.headers.authorization !== ctx.appConfig.key.AppSecret) {
      throw new PermissionError();
    }
    await next()
  }
}