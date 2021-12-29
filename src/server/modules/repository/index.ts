import LocalRepository from './local'
import RemoteRepository from './remote'

const getLocalRepository = () => LocalRepository.getInstance<LocalRepository>()
export const getRemoteRepository = () => RemoteRepository.getInstance<RemoteRepository>()

export const getRepository = (type:string) => {
    if(type.toLowerCase() === 'local'){
        return getLocalRepository()
    }else{
        return getRemoteRepository()
    }
}