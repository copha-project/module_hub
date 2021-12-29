import { Context } from 'koa'
import { AddModule, ModuleModel, Module } from './model'
import { getManager } from './manager'
import Controller from '../../class/controller'

export class ModuleController extends Controller {
  private manager = getManager()

  public async getAll(ctx: Context) {
    const modules = await this.manager.all()
    ctx.body = modules.map((t: Module) => new ModuleModel(t))
    ctx.status = 200
  }

  public async get(ctx: Context) {
    const module = await this.manager.findFullModuleByName(ctx.params.name)
    if(module){
        ctx.body = module
        ctx.status = 200
    }else{
        ctx.status = 404
    }
  }

  public async update(ctx: Context) {
    const module = await this.manager.findByName(ctx.params.name)
    try {
      await this.manager.update(module!)
      ctx.status = 200
    } catch (error) {
      console.log(error);
      
      ctx.status = 500
    }
  }

  public async create(ctx: Context) {
    const module: AddModule = ctx.request.body
    const newModule = await this.manager.create(module as Module)
    if(newModule){
        ctx.body = new ModuleModel(newModule)
        ctx.status = 201
    }else{
        ctx.status = 202
    }
  }

  public async delete(ctx: Context) {
    if(await this.manager.delete(ctx.params.id)){
      ctx.status = 200
    }else{
      ctx.status = 204
    }
  }

  public async genID(ctx: Context){
    ctx.body = require('crypto').randomUUID()
  }
}