import { Context } from 'koa'
import Controller from '../../class/controller'

export class HomeController extends Controller {
  public async home(ctx: Context) {
    ctx.body = {
      name: "copha modules hub service",
      version: (await import('../../../package.json')).version
    }
  }
}