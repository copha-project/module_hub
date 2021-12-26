import path from 'path'
import { ServerConfig, DBConfig } from '../config'
import Logger from './logger'

export default class Base {
    private _serverConfig = ServerConfig
    private _dbConfig = DBConfig

    static log = new Logger()

    static instance: Base
    static getInstance<T extends Base>(){
        if(!this.instance){
            this.instance = new this()
        }
        return this.instance as T
    }
    
    get isPackageHub(){
        return process.env['PACKAGE_HUB'] !== ''
    }

    get publicPath(){
        return path.join(__dirname,'../public')
    }

    get serverConfig(){
        if(process.env.PORT){
            this._serverConfig.port = process.env.PORT
        }
        return this._serverConfig
    }

    get appRootPath(){
        return path.join(__dirname,'../../')
    }

    get deployKey(){
        return process.env.DEPLOY_KEY || "1122345"
    }

    get dbConfig(){
        return this._dbConfig
    }

    get log(){
        return Base.log
    }
}