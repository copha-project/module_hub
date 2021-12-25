import { Context } from 'koa'
import Controller from '../../class/controller'
import Utils from 'uni-utils'
import path from 'path'
import { getEnvInfo } from '../../common'
import { exec } from 'child_process'
import { promisify } from 'util'
const execPromise = promisify(exec)

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

  public async deploy(ctx: Context) {
    if(ctx.query.key != this.deployKey) {
      ctx.status = 403
      return
    }
    try {
      const {stdout,stderr} = await execPromise('git pull')
      ctx.body = stdout
    } catch (error) {
      ctx.body = (error as Error).message
    }
    ctx.status = 200
  }
}