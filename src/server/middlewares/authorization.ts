import { Context } from 'koa'
import { PermissionError } from '../../class/error';
import { IMiddleware } from 'koa-router'

export function authorization(): IMiddleware {
  return async (ctx: Context, next: Callback) => {
    if (ctx.headers.authorization !== "123") {
      throw new PermissionError();
    }
    await next()
  }
}