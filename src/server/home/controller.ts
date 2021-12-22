import { Context } from 'koa'
import Controller from '../../class/controller'
import Utils from 'uni-utils'
import path from 'path'
import { getEnvInfo } from '../../common'

export class HomeController extends Controller {
  public async home(ctx: Context) {
    ctx.type = 'html'
    ctx.body = "ok<br/><a href='/status'>look status</a>"
  }

  public async status(ctx: Context) {
    ctx.body = {
      name: "copha modules hub service",
      version: (await Utils.readJson(path.join(__dirname,'../../../package.json'))).version,
      ... getEnvInfo()
    }
  }
}