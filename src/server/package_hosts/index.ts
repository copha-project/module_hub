import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Router from '@koa/router'
import { adminAuthorization, validate } from '../../middlewares'
import { PackageHostController } from './controller'
import { createPackageHost } from './validators'

export function getRoutes() {
  const router = new Router({ prefix: '/package_hosts' })
  const controller = PackageHostController.getInstance<PackageHostController>()

  router.get(
    '/',
    controller.getMethod('getAll')
  )
  
  router.post(
    '/',
    adminAuthorization(),
    bodyParser(),
    validate(createPackageHost),
    controller.getMethod('create')
  )
  return router.routes()
}