import { Context } from 'koa'
import { getManager } from './manager'
import Controller from '../../class/controller'
import { Module, ModuleModel, UpdateModule, AddModule, AddPackage } from './model'

export class ModuleController extends Controller {
  private manager = getManager()

  public async resetId(ctx: Context){
    await this.manager.resetId(ctx.params.name, ctx.request.body.id)
    ctx.status = 200
  }

  public async getAll(ctx: Context) {
    const modules = await this.manager.all()
    ctx.body = modules.map((t: Module) => new ModuleModel(t))
  }

  public async get(ctx: Context) {
    ctx.body = await this.manager.findByName(ctx.params.name)
  }

  public async update(ctx: Context) {
    const module = await this.manager.findByName(ctx.params.name)
    const updateData: UpdateModule = ctx.request.body
    return this.manager.update(module.name, updateData)
  }

  public async create(ctx: Context) {
    const module: AddModule = ctx.request.body
    module.id = require('crypto').randomUUID()
    module.packages = []
    const newModule = await this.manager.create(module as Module)
    ctx.body = new ModuleModel(newModule)
    ctx.status = 201
  }

  public async delete(ctx: Context) {
    if (await this.manager.delete(ctx.params.id)) {
      ctx.status = 200
    } else {
      ctx.status = 204
    }
  }

  public async getAllPackage(ctx: Context){
    const module = await this.manager.findByName(ctx.params.name)
    ctx.body = module.packages
  }

  public async addPackage(ctx: Context) {
    const module = await this.manager.findByName(ctx.params.name)
    const modulePackage: AddPackage = ctx.request.body
    const newPackage = await this.manager.addPackage(module, modulePackage)
    ctx.body = newPackage
    ctx.status = 201
  }
}