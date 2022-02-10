import bodyParser from 'koa-bodyparser'
import bodyDataParser from 'koa-body'
import Router from '@koa/router'
import { HomeController } from './controller'
import { adminAuthorization, moduleAuthorization, validate } from '../../middlewares'
import { revealToken } from './validators'

export function getRoutes() {
  const router = new Router()
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
    bodyParser(),
    adminAuthorization(),
    validate(revealToken),
    controller.getMethod('revealToken')
  )
  
  if(controller.config.isPackageHub){
    router.post(
      '/upload',
      bodyDataParser({multipart: true}),
      moduleAuthorization(),
      controller.getMethod('upload')
    )
  }
  
  return router.routes()
}
