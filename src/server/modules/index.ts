import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Router from 'koa-router'
import { ModuleController } from './controller'

export function init(server: Koa) {
  const router = new Router({ prefix: '/api/v1/modules' })
  const controller = new ModuleController

  router.get(
    '/',
    controller.get.bind(controller)
  )

  router.post(
    '/',
    bodyParser(),
    controller.create.bind(controller)
  )

  router.delete(
    '/:name',
    controller.delete.bind(controller)
  )

  server.use(router.routes())
}