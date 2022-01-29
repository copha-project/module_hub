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
    const moduleIdHex = Buffer.from(require('crypto').randomUUID()).toString('hex')
    ctx.body = {
      moduleId: Buffer.from(moduleIdHex,'hex').toString(),
      token: `${moduleIdHex}:${Utils.hash.sha1(this.keyConfig.AppKey+moduleIdHex+this.keyConfig.AppSecret)}`
    }
  }
  
  public async revealToken(ctx: Context){
    const id = Buffer.from(ctx.request.body.id).toString('hex')
    ctx.body = {
      moduleId: ctx.request.body.id,
      token: `${id}:${Utils.hash.sha1(this.keyConfig.AppKey+id+this.keyConfig.AppSecret)}`
    }
  }

  public async packageHostConfig(ctx: Context){
    ctx.body = {
      hosts: getRemoteRepository().getPackageStorageLink(),
      api: {
        upload: '/upload'
      }
    }
  }

  //upload package
  public async upload(ctx: Context){
    const tempFile = ctx.request.files?.package as any
    const packageSaveDir = path.join(this.packageStoragePath,ctx.state.moduleId)
    await Utils.createDir(packageSaveDir)
    const fileName = `${ctx.request.body.version}`
    await Utils.copyFile(tempFile?.path, path.join(packageSaveDir, fileName))
    await Utils.rm(tempFile?.path)
    ctx.status = 200
  }
}