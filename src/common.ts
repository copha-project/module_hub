import { Context } from 'koa'
import os from 'os'
import path from 'path'
import fs from 'fs'
import Busboy from 'busboy'
import Utils from 'uni-utils'
import { validate } from 'uuid'

export const getEnvInfo = function(){
    return {
        nodeVersion: process.versions['node'],
        hostname: os.hostname(),
        platform: `${process.platform}/${process.arch}`
    }
}

export function isUUID(s:string){
  return validate(s)
}

export async function uploadFile(ctx: Context, saveDir:string) {    
    return new Promise((resolve, reject) => {
      const busboy = Busboy({headers: ctx.req.headers as {'content-type':string}})
      const tmpFilePath = path.join(os.tmpdir(), `${new Date().getTime()}`)
      let version = ""
      busboy.on('file', function(fieldname, file, info:{filename:string,encoding:string,mimeType:string}) {
        if(fieldname !== 'package') return reject(Error("file field not found!"))

        if(!info.filename.endsWith('.tar.gz')){
          reject(Error("file format error!"))
          return
        }

        file.pipe(fs.createWriteStream(tmpFilePath))
        console.log('save tmp file: ',tmpFilePath)
      })

      busboy.on('field', function(fieldname, val, info) {
        if(fieldname === 'version'){
          version = val
        }
      })

      busboy.on('finish', async ()=>{
        if(!await Utils.fileExist(tmpFilePath)) return reject(Error("no file be upload!"))
        if(!version) return reject(Error("version value error!"))
  
        try {
          let fileName = `${version}.tar.gz`
          await Utils.createDir(saveDir)
          let saveTo = path.join(saveDir, fileName)
          await Utils.copyFile(tmpFilePath, saveTo)
          await Utils.rm(tmpFilePath)
          resolve(null)
        } catch (error) {
          reject(error)
        }
      })
  
      busboy.on('error', reject)
      ctx.req.pipe(busboy)
    })
  } 