import { Context } from 'koa'
import Controller from '../../class/controller'
import { getRemoteRepository } from '../modules/repository'
import { PackageHostItem } from './model'

export class PackageHostController extends Controller {
  public async getAll(ctx: Context){
    ctx.body = getRemoteRepository().getPackageStorageLink()
  }
  public async create(ctx: Context){
    const hostItem: PackageHostItem = ctx.request.body
    // todo
    // update package host data
    ctx.body = hostItem
  }
} 