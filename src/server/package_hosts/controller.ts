import { Context } from 'koa'
import Controller from '../../class/controller'
import { getManager } from './manager'
import { getRepository } from '../../repository'
import { PackageHost } from './model'

export class PackageHostController extends Controller {
  private manager = getManager()
  public async getAll(ctx: Context){
    ctx.body = await this.manager.all()
  }
  public async create(ctx: Context){
    const hostItem: PackageHost = ctx.request.body
    // todo
    // update package host data
    ctx.body = hostItem
  }
} 