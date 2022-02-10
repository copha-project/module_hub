import { Context } from 'koa'
import Controller from '../../class/controller'
import { getRepository, RepositorySource } from '../../repository'
import { PackageHostItem } from './model'

export class PackageHostController extends Controller {
  public async getAll(ctx: Context){
    ctx.body = await getRepository(RepositorySource.remote).getPackageStorageLink()
  }
  public async create(ctx: Context){
    const hostItem: PackageHostItem = ctx.request.body
    // todo
    // update package host data
    ctx.body = hostItem
  }
} 