import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Router from 'koa-router'
import { ModuleController } from './controller'

export function init(server: Koa) {
  const router = new Router({ prefix: '/api/v1/modules' })
  const controller = ModuleController.getInstance() as ModuleController

  router.get(
    '/:id',
    controller.get.bind(controller)
  )
  
  router.get(
    '/',
    controller.getAll.bind(controller)
  )

  router.post(
    '/',
    bodyParser(),
    controller.create.bind(controller)
  )

  router.delete(
    '/:id',
    controller.delete.bind(controller)
  )

  server.use(router.routes())
}