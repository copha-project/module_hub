import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Router from 'koa-router'
import { HomeController } from './controller'
import { adminAuthorization, moduleAuthorization, validate } from '../middlewares'
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
    '/package_hosts',
    controller.getMethod('packageHostConfig')
  )

  router.get(
    '/token',
    adminAuthorization(),
    controller.getMethod('genToken')
  )

  router.put(
    '/token',
    bodyParser(),
    adminAuthorization(),
    validate(revealToken),
    controller.getMethod('revealToken')
  )
  
  if(controller.isPackageHub){
    router.post(
      '/upload',
      moduleAuthorization(),
      controller.getMethod('upload')
    )
  }

  server.use(router.routes())
}