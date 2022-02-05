import Koa from 'koa'
import Router from 'koa-router'
import { PackageHostController } from './controller'

export function init(app: Koa) {
  const router = new Router({ prefix: '/api/v1/package_hosts' })
  const controller = PackageHostController.getInstance<PackageHostController>()

  router.get(
    '/',
    controller.getMethod('getAll')
  )

  app.use(router.routes())
}