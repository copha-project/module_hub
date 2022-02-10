import { getConfig } from '../class/config'
import { getLocalRepository } from './local'
import { getRemoteRepository } from './remote'

export enum RepositorySource{
    local,
    remote
}

export const getRepository = (type?:RepositorySource) => {
    if(!type){
        type = getConfig().dbConfig.RepositorySource === 'local' ? RepositorySource.local : RepositorySource.remote
    }
    if(type === RepositorySource.local){
        return getLocalRepository()
    }else{
        return getRemoteRepository()
    }
}