import os from 'os'

export const getEnvInfo = function(){
    return {
        nodeVersion: process.versions['node'],
        hostname: os.hostname(),
        platform: `${process.platform}/${process.arch}`
    }
}