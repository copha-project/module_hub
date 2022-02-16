import bodyParser from 'koa-body'
import Router from '@koa/router'
import { getModuleController } from './controller'
import { validate, moduleAuthorization, adminAuthorization } from '../../middlewares'
import { createModule, createModulePackage, updateModule } from './validators'

export function getRoutes() {
  const router = new Router({ prefix: '/modules' })
  const controller = getModuleController()

  router.get(
    '/',
    controller.getMethod('getAll')
  )

  router.get(
    '/:id',
    controller.getMethod('get')
  )

  router.post(
    '/',
    bodyParser(),
    adminAuthorization(),
    validate(createModule),
    controller.getMethod('create')
  )

  router.put(
    '/:id',
    bodyParser(),
    moduleAuthorization(),
    validate(updateModule),
    controller.getMethod('update')
  )

  router.delete(
    '/:id',
    adminAuthorization(),
    controller.getMethod('delete')
  )
  
  // package api
  router.get(
    "/:id/packages/:ver",
    controller.getMethod("getPackage")
  )

  router.get(
    "/:id/packages",
    controller.getMethod("getAllPackage")
  )
  
  router.post(
    "/:id/packages",
    moduleAuthorization(),
    bodyParser(),
    validate(createModulePackage),
    controller.getMethod("addPackage")
  )

  router.delete(
    "/:id/packages/:ver",
    moduleAuthorization(),
    controller.getMethod("deletePackage")
  )

  return router.routes()
}