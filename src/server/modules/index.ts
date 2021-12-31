import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Router from 'koa-router'
import { ModuleController } from './controller'
import { validate, authorization } from '../middlewares'
import { createModule, createModulePackage, updateModule } from './validators'

export function init(app: Koa) {
  const router = new Router({ prefix: '/api/v1/modules' })
  const controller = ModuleController.getInstance<ModuleController>()

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
    authorization(),
    bodyParser(),
    validate(updateModule),
    controller.getMethod('update')
  )

  router.delete(
    '/:id',
    controller.getMethod('delete')
  )

  router.get(
    "/:name/packages",
    controller.getMethod("getAllPackage")
  )
  router.post(
    "/:name/packages",
    authorization(),
    bodyParser(),
    validate(createModulePackage),
    controller.getMethod("addPackage")
  )

  app.use(router.routes())
}