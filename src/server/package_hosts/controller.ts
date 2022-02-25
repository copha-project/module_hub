import { Context } from 'koa'
import { getCrypto } from '../../class/crypto'
import Controller from '../../class/controller'
import { getManager } from './manager'
import { PackageHost, PackageHostModel } from './model'
import Utils from 'uni-utils'

export class PackageHostController extends Controller {
  private manager = getManager()
  
  public async get(ctx: Context) {
    const item = await this.manager.findById<PackageHost>(ctx.params.id)
    ctx.body = new PackageHostModel(item)
  }

  public async getAll(ctx: Context){
    const hosts = await this.manager.all<PackageHost>()
    ctx.body = hosts
  }

  public async create(ctx: Context){
    const hostItem: PackageHost = ctx.request.body
    ctx.body = await this.manager.create(hostItem)
  }

  public async update(ctx: Context){
    const hostItem: PackageHost = ctx.request.body
    hostItem.id = ctx.params.id
    ctx.body = await this.manager.update(hostItem)
  }

  public async delete(ctx: Context){
    ctx.body = await this.manager.delete(ctx.params.id)
  }

  public async showKey(ctx: Context){
    const host = await this.manager.findById<PackageHost>(ctx.params.id)
    ctx.body = Utils.btoa(getCrypto().decrypt(host.key, this.config.keyConfig.AppSecret).toString())
  }
} 