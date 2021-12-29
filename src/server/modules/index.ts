import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Router from 'koa-router'
import { ModuleController } from './controller'
import { validate, authorization } from '../middlewares'
import { createModule, updateModule } from './validators'

export function init(server: Koa) {
  const router = new Router({ prefix: '/api/v1/modules' })
  const controller = ModuleController.getInstance<ModuleController>()

  router.post(
    '/id',
    controller.getMethod('genID')
  )

  router.get(
    '/:name',
    controller.getMethod('get')
  )
  
  router.get(
    '/',
    controller.getMethod('getAll')
  )

  router.post(
    '/',
    authorization(),
    bodyParser(),
    validate(createModule),
    controller.getMethod('create')
  )

  router.put(
    '/:name',
    controller.getMethod('update')
  )

  router.delete(
    '/:id',
    controller.getMethod('delete')
  )

  server.use(router.routes())
}