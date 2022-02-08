import { Context } from 'koa'
import { getManager } from './manager'
import Controller from '../../class/controller'
import { PermissionError } from '../../class/error';
import { Module, ModuleModel, UpdateModule, AddModule, AddPackage } from './model'
import { isUUID } from '../../common'
export class ModuleController extends Controller {
  private manager = getManager()

  public async resetId(ctx: Context){
    await this.manager.resetId(ctx.params.name, ctx.request.body.id)
  }

  public async getAll(ctx: Context) {
    const modules = await this.manager.all()
    ctx.body = modules.map((t: Module) => new ModuleModel(t))
  }

  public async get(ctx: Context) {
    if(isUUID(ctx.params.id)){
      ctx.body = new ModuleModel(await this.manager.findById(ctx.params.id),true)
    }else{
      ctx.body = new ModuleModel(await this.manager.findByName(ctx.params.id),true)
    }
  }

  public async update(ctx: Context) {
    const module = await this.manager.findByName(ctx.params.name)
    if(module.id !== ctx.state.moduleId) throw new PermissionError()
    const updateData: UpdateModule = ctx.request.body
    const updateModule = await this.manager.update(module, updateData)
    ctx.body = new ModuleModel(updateModule)
  }

  public async create(ctx: Context) {
    const module: AddModule = ctx.request.body
    module.id = require('crypto').randomUUID()
    module.packages = []
    const newModule = await this.manager.create(module as Module)
    ctx.body = new ModuleModel(newModule)
  }

  public async delete(ctx: Context) {
    await this.manager.delete(ctx.params.id)
    ctx.status = 204
  }

  public async getAllPackage(ctx: Context){
    const module = await this.manager.findByName(ctx.params.name)
    ctx.body = module.packages
  }

  public async addPackage(ctx: Context) {
    const module = await this.manager.findByName(ctx.params.name)
    if(module.id !== ctx.state.moduleId) throw new PermissionError()

    const modulePackage: AddPackage = ctx.request.body
    const newPackage = await this.manager.addPackage(module, modulePackage)
    ctx.body = newPackage
  }

  public async deletePackage(ctx: Context) {
    const module = await this.manager.findByName(ctx.params.name)
    if(module.id !== ctx.state.moduleId) throw new PermissionError()
    await this.manager.removePackageByVersion(module, ctx.params.ver)
  }
}