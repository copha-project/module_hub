import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Router from 'koa-router'
import { ModuleController } from './controller'
import { validate } from '../middlewares'
import { createModule, updateModule } from './validators'

export function init(server: Koa) {
  const router = new Router({ prefix: '/api/v1/modules' })
  const controller = ModuleController.getInstance<ModuleController>()

  router.get(
    '/:id',
    controller.getMethod('get')
  )
  
  router.get(
    '/',
    controller.getMethod('getAll')
  )

  router.post(
    '/',
    bodyParser(),
    validate(createModule),
    controller.getMethod('create')
  )

  router.delete(
    '/:id',
    controller.getMethod('delete')
  )

  server.use(router.routes())
}