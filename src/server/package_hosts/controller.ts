import { Context } from 'koa'
import Controller from '../../class/controller'
import { getManager } from './manager'
import { PackageHost, PackageHostModel } from './model'

export class PackageHostController extends Controller {
  private manager = getManager()
  
  public async get(ctx: Context) {
    const item = await this.manager.findById<PackageHost>(ctx.params.id)
    ctx.body = new PackageHostModel(item)
  }

  public async getAll(ctx: Context){
    ctx.body = await this.manager.all()
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
} 