import Logger from './logger'
import { getConfig } from './config'
import path from 'path'
export default class Base {
    public config = getConfig()
    static log = new Logger()

    static instance: Base
    static getInstance<T extends Base>(){
        if(!this.instance){
            this.instance = new this()
        }
        return this.instance as T
    }
    get deployPath(){
        return path.join(this.config.appRootPath,'../deploy.sh')
    }

    get dataSource(){
        return {
            isLocal: this.config.dbConfig.RepositorySource.toLocaleLowerCase() === 'local',
            isRemote: this.config.dbConfig.RepositorySource.toLocaleLowerCase() === 'remote'
        }
    }

    get log(){
        return Base.log
    }
}