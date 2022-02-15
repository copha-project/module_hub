import bodyParser from 'koa-body'
import Router from '@koa/router'
import { adminAuthorization, validate } from '../../middlewares'
import { PackageHostController } from './controller'
import { createPackageHost, updatePackageHost } from './validators'

export function getRoutes() {
  const router = new Router({ prefix: '/package_hosts' })
  const controller = PackageHostController.getInstance<PackageHostController>()

  router.get(
    '/',
    controller.getMethod('getAll')
  )
  
  router.get(
    '/:id',
    controller.getMethod('get')
  )

  router.delete(
    '/:id',
    adminAuthorization(),
    controller.getMethod('delete')
  )

  router.post(
    '/',
    adminAuthorization(),
    bodyParser(),
    validate(createPackageHost),
    controller.getMethod('create')
  )

  router.put(
    '/',
    adminAuthorization(),
    bodyParser(),
    validate(updatePackageHost),
    controller.getMethod('update')
  )

  return router.routes()
}