import { Context } from 'koa'
import Base from '../../class/base'
import multer from '@koa/multer'

export async function reqLog(ctx: Context, next: Callback){
    const start = Date.now()
    await next()
    const ms = Date.now() - start
    Base.log.info(`${ctx.method} ${ctx.url} ${ctx.status} - ${ms} ms`)
}



const storage = multer.diskStorage({
  destination: function (req:any, file:any, cb:any) {
    cb(null, '/tmp/my-uploads')
  },
  filename: function (req:any, file:any, cb:any) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

export function uploadMid(name:string){
   return multer({ storage: storage }).single(name)
}