import os from 'os'
import fs from 'fs'
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

export function setExec(file: string){
  fs.chmodSync(file, 0o700)
}