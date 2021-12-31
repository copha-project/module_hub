import { Context } from 'koa'
import Controller from '../../class/controller'
import Utils from 'uni-utils'
import path from 'path'
import { getEnvInfo } from '../../common'
import { exec } from 'child_process'
import { promisify } from 'util'
import { getRemoteRepository } from '../modules/repository'
const execPromise = promisify(exec)

export class HomeController extends Controller {
  public async home(ctx: Context) {
    ctx.type = 'html'
    ctx.body = "ok<br/><a href='/status'>look status</a>"
  }

  public async status(ctx: Context) {    
    ctx.body = {
      name: "copha modules hub service",
      appKey: this.appConfig.AppKey,
      version: (await Utils.readJson(path.join(__dirname,'../../../package.json'))).version,
      isPackageHub: this.isPackageHub,
      lastCommitHash: (await getRemoteRepository().getLastCommit()).sha,
      ... getEnvInfo()
    }
  }

  public async deploy(ctx: Context) {
    if(ctx.request.body.key !== this.deployKey) {
      ctx.status = 403
      return
    }
    try {
      const deployFile = path.join(this.appRootPath,'deploy.sh')
      const {stdout,stderr} = await execPromise(deployFile,{
        windowsHide : true
      })

      ctx.body = stdout + "\n" +stderr
    } catch (error) {
      ctx.body = (error as Error).message
    }
    ctx.status = 200
  }

  public async genToken(ctx: Context){
    const salt = require('crypto').randomBytes(6).toString('hex')
    ctx.body = `${salt}:${Utils.hash.sha1(this.appConfig.AppSecret+Utils.atob(ctx.params.name)+salt)}`
  }
}