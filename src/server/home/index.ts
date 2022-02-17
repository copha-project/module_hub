import bodyParser from 'koa-body'
import Router from '@koa/router'
import { getController } from './controller'
import { adminAuthorization, moduleAuthorization, validate } from '../../middlewares'
import { revealToken, updateId } from './validators'

export function getRoutes() {
  const router = new Router()
  const controller = getController()

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
  
  router.put(
    '/:id/id',
    adminAuthorization(),
    bodyParser(),
    validate(updateId),
    controller.getMethod('resetId')
  )

  if(controller.config.isPackageHub){
    router.post(
      '/upload/:id',
      bodyParser({multipart: true}),
      moduleAuthorization(),
      controller.getMethod('upload')
    )
  }
  
  return router.routes()
}
