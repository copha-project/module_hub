import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Router from 'koa-router'
import { HomeController } from './controller'
import { adminAuthorization, moduleAuthorization, validate, uploadMid } from '../middlewares'
import { revealToken } from './validators'

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

  router.post(
    '/deploy',
    bodyParser(),
    controller.getMethod('deploy')
  )

  router.get(
    '/token',
    adminAuthorization(),
    controller.getMethod('genToken')
  )

  router.put(
    '/token',
    adminAuthorization(),
    bodyParser(),
    validate(revealToken),
    controller.getMethod('revealToken')
  )

  router.post(
    '/upload',
    moduleAuthorization(),
    uploadMid('package'),
    controller.getMethod('upload')
  )

  server.use(router.routes())
}