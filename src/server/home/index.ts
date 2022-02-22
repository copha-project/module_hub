import bodyParser from 'koa-body'
import Router from '@koa/router'
import { getController } from './controller'
import { adminAuthorization, moduleAuthorization, validate } from '../../middlewares'
import { revealToken, updateId, upload } from './validators'
import { getConfig } from '../../class/config'

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
  
  router.post(
    '/deploy',
    bodyParser(),
    controller.getMethod('deploy')
  )

  router.post(
    '/reset_module_id',
    adminAuthorization(),
    bodyParser(),
    validate(updateId),
    controller.getMethod('resetId')
  )

  if(getConfig().isPackageHub){
    router.post(
      '/upload/:id',
      moduleAuthorization(),
      bodyParser({multipart: true}),
      validate(upload),
      controller.getMethod('upload')
    )
  }
  
  return router.routes()
}
