import path from 'path'
import { ServerConfig, DBConfig, KeyConfig } from '../config'
import Logger from './logger'
export default class Base {
    private _serverConfig = ServerConfig
    private _dbConfig = DBConfig
    private _keyConfig = KeyConfig

    static log = new Logger()

    static instance: Base
    static getInstance<T extends Base>(){
        if(!this.instance){
            this.instance = new this()
        }
        return this.instance as T
    }
    
    get isPackageHub(){
        return process.env.PACKAGE_HUB !== undefined
    }

    get publicPath(){
        return process.env.APP_PUBLIC_PATH || path.join(__dirname,'../public')
    }

    get packageStoragePath(){
        return process.env.APP_PACKAGE_STORAGE_PATH || path.join(this.publicPath,'packages')
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
        return process.env.DEPLOY_KEY || Math.random().toString(16)
    }

    get dbConfig(){
        if(process.env.APP_DB_SOURCE){
            this._dbConfig.RepositorySource = process.env.APP_DB_SOURCE
        }
        return this._dbConfig
    }

    get keyConfig(){
        if(process.env.APP_KEY){
            this._keyConfig.AppKey = process.env.APP_KEY
        }
        if(process.env.APP_SECRET){
            this._keyConfig.AppSecret = process.env.APP_SECRET
        }
        if(process.env.GITHUB_TOKEN){
            this._keyConfig.GithubToken = process.env.GITHUB_TOKEN
        }
        return this._keyConfig
    }

    get appConfig(){
        return {
            server: this.serverConfig,
            key: this.keyConfig,
            db: this.dbConfig
        }
    }

    get log(){
        return Base.log
    }
}