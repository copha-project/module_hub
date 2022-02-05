import { Context } from 'koa'
import Controller from '../../class/controller'
import { getRemoteRepository } from '../modules/repository'

export class PackageHostController extends Controller {
  public async getAll(ctx: Context){
    ctx.body = getRemoteRepository().getPackageStorageLink()
  }
}