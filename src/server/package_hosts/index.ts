import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Router from 'koa-router'
import { adminAuthorization, validate } from '../middlewares'
import { PackageHostController } from './controller'
import { createPackageHost } from './validators'

export function init(app: Koa) {
  const router = new Router({ prefix: '/api/v1/package_hosts' })
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
  app.use(router.routes())
}