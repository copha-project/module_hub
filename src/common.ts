import { Context } from 'koa'
import os from 'os'
import path from 'path'
import fs from 'fs'
import Busboy from 'busboy'
import Utils from 'uni-utils'

export const getEnvInfo = function(){
    return {
        nodeVersion: process.versions['node'],
        hostname: os.hostname(),
        platform: `${process.platform}/${process.arch}`
    }
}

export async function uploadFile(ctx: Context, saveDir:string) {
    const req = ctx.req
    let busboy = Busboy({headers: req.headers as {'content-type':string}})
    
    return new Promise((resolve, reject) => {
      // 解析请求文件事件
      busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        let fileName = "module.zip"
        let _uploadFilePath = path.join( saveDir, fileName )
        let saveTo = path.join(_uploadFilePath)
        // 文件保存到制定路径
        file.pipe(fs.createWriteStream(saveTo))
        // 文件写入事件结束
        file.on('end', resolve)
      })
      // 解析结束事件
      busboy.on('finish', resolve)
  
      // 解析错误事件
      busboy.on('error', reject)
  
      req.pipe(busboy)
    })
  
  } 