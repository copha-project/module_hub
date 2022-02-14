import { Context } from 'koa'
import Controller from '../../class/controller'
import { getManager } from './manager'
import { PackageHost } from './model'

export class PackageHostController extends Controller {
  private manager = getManager()
  
  public async get(ctx: Context) {
    ctx.body = await this.manager.findById(ctx.params.id)
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
    const queryItem = await this.manager.findById(hostItem.id)
    ctx.body = await this.manager.update(queryItem, hostItem)
  }

  public async delete(ctx: Context){
    ctx.body = await this.manager.delete(ctx.params.id)
  }
} 