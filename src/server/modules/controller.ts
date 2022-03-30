import { Context } from 'koa'
import { getManager } from './manager'
import { getPackageHostManager } from '../package_hosts/manager'
import Controller from '../../class/controller'
import { PermissionError } from '../../class/error';
import { Module, ModuleModel, AddPackage } from './model'
export class ModuleController extends Controller {
  private manager = getManager()
  private packageHostManager = getPackageHostManager()

  public async getAll(ctx: Context) {
    const modules = await this.manager.all<Module>()
    ctx.body = modules.map((t: Module) => new ModuleModel(t))
  }

  public async get(ctx: Context) {
    ctx.body = ModuleModel.createFullModule(await this.manager.findById(ctx.params.id))
  }

  public async create(ctx: Context) {
    const module: Module = ctx.request.body
    const newModule = await this.manager.create(module)
    ctx.body = new ModuleModel(newModule)
  }

  public async update(ctx: Context) {
    const module = await this.manager.findById<Module>(ctx.params.id)
    if(module.id !== ctx.state.moduleId) throw new PermissionError()
    const updateData: Module = ctx.request.body
    // set module id from token
    updateData.id = ctx.state.moduleId
    const updateModule = await this.manager.update(updateData)
    ctx.body = new ModuleModel(updateModule)
  }

  public async delete(ctx: Context) {
    ctx.body = await this.manager.delete(ctx.params.id)
  }

  public async getAllPackage(ctx: Context){
    const module = await this.manager.findById<Module>(ctx.params.id)
    ctx.body = module.packages
  }

  public async getPackage(ctx: Context){
    const packageItem = await this.manager.getPackage(ctx.params.id, ctx.params.ver)
    const packageHost = await this.packageHostManager.getFullHost(packageItem.package_host!)
    
    ctx.body = {
      ...packageItem,
      url: packageHost.fetchPoint.replace('{id}',ctx.params.id).replace('{ver}', ctx.params.ver)
    }
  }

  public async addPackage(ctx: Context) {
    const module = await this.manager.findById<Module>(ctx.params.id)
    if(module.id !== ctx.state.moduleId) throw new PermissionError()

    const modulePackage: AddPackage = ctx.request.body
    ctx.body = await this.manager.addPackage(module, modulePackage)
  }

  public async deletePackage(ctx: Context) {
    const module = await this.manager.findById<Module>(ctx.params.id)
    if(module.id !== ctx.state.moduleId) throw new PermissionError()
    ctx.body = await this.manager.removePackageByVersion(module, ctx.params.ver)
  }
}

export const getModuleController = () => ModuleController.getInstance<ModuleController>()