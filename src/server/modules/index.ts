import bodyParser from 'koa-bodyparser'
import Router from '@koa/router'
import { ModuleController } from './controller'
import { validate, moduleAuthorization, adminAuthorization } from '../middlewares'
import { createModule, createModulePackage, updateId, updateModule } from './validators'

export function init(appRouter: Router) {
  const router = new Router({ prefix: '/modules' })
  const controller = ModuleController.getInstance<ModuleController>()

  router.get(
    '/:id',
    controller.getMethod('get')
  )

  router.put(
    '/:name/id',
    adminAuthorization(),
    bodyParser(),
    validate(updateId),
    controller.getMethod('resetId')
  )

  router.get(
    '/',
    controller.getMethod('getAll')
  )

  router.post(
    '/',
    adminAuthorization(),
    bodyParser(),
    validate(createModule),
    controller.getMethod('create')
  )

  router.put(
    '/:name',
    moduleAuthorization(),
    bodyParser(),
    validate(updateModule),
    controller.getMethod('update')
  )

  router.delete(
    '/:id',
    adminAuthorization(),
    controller.getMethod('delete')
  )

  router.get(
    "/:name/packages",
    controller.getMethod("getAllPackage")
  )
  
  router.post(
    "/:name/packages",
    moduleAuthorization(),
    bodyParser(),
    validate(createModulePackage),
    controller.getMethod("addPackage")
  )

  router.delete(
    "/:name/packages/:ver",
    moduleAuthorization(),
    controller.getMethod("deletePackage")
  )

  appRouter.use(router.routes())
}