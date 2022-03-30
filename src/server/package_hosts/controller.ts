import { Context } from 'koa'
import { getCrypto } from '../../class/crypto'
import Controller from '../../class/controller'
import { getManager } from './manager'
import { PackageHost, PackageHostModel } from './model'
import Utils from 'uni-utils'

export class PackageHostController extends Controller {
  private manager = getManager()
  
  public async get(ctx: Context) {
    ctx.body = await this.manager.getFullHost(ctx.params.id)
  }

  public async getAll(ctx: Context){
    const hosts = await this.manager.all<PackageHost>()
    ctx.body = hosts.map(e => new PackageHostModel(e))
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

  public async showSecret(ctx: Context){
    const host = await this.manager.findById<PackageHost>(ctx.params.id)
    host.secret!.key = Utils.btoa(getCrypto().decrypt(host.secret!.key, this.config.keyConfig.AppSecret).toString())
    ctx.body = host
  }
} 