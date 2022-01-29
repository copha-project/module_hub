import os from 'os'
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