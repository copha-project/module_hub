import { Context } from 'koa'
import { AddModule, ModuleModel, Module } from './model'
import { ModuleManager } from './manager'
import Controller from '../../class/controller'

export class ModuleController extends Controller {
  private manager: ModuleManager

  constructor(){
    super()
    this.manager = new ModuleManager()
  }

  public async create(ctx: Context) {
    const module: AddModule = ctx.request.body
    const newModule = await this.manager.create(module as Module)
    if(newModule){
        ctx.body = new ModuleModel(newModule)
        ctx.status = 200
    }else{
        ctx.status = 500
    }
  }

  public async get(ctx: Context) {
    const module = await this.manager.findByName(ctx.params.name)
    if(module){
        ctx.body = new ModuleModel(module)
        ctx.status = 200
    }else{
        ctx.status = 404
    }
  }

  public async delete(ctx: Context) {
    await this.manager.delete(ctx.params.name)
    ctx.status = 204
  }
}