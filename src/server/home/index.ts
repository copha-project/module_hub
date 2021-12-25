import Koa from 'koa'
import Router from 'koa-router'
import { HomeController } from './controller'

export function loadHome(server: Koa) {
  const router = new Router({ prefix: '' })
  const controller = HomeController.getInstance<HomeController>()

  router.get(
    '/',
    controller.getMethod('home')
  )

  router.get(
    '/status',
    controller.getMethod('status')
  )

  router.get(
    '/deploy',
    controller.getMethod('deploy')
  )

  server.use(router.routes())
}