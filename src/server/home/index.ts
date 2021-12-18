import Koa from 'koa'
import Router from 'koa-router'
import { HomeController } from './controller'

export function loadHome(server: Koa) {
  const router = new Router({ prefix: '' })
  const controller = HomeController.getInstance() as HomeController

  router.get(
    '/',
    controller.home.bind(controller)
  )

  server.use(router.routes())
}