import { Context } from 'koa'
import Controller from '../../class/controller'
import { getManager } from './manager'
import { PackageHost } from './model'

export class PackageHostController extends Controller {
  private manager = getManager()
  
  public async getAll(ctx: Context){
    ctx.body = await this.manager.all()
  }

  public async create(ctx: Context){
    const hostItem: PackageHost = ctx.request.body
    ctx.body = await this.manager.create(hostItem)
  }
} 