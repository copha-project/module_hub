import path from 'path'
import { ServerConfig, DBConfig, AppConfig } from '../config'
import Logger from './logger'

export default class Base {
    private _serverConfig = ServerConfig
    private _dbConfig = DBConfig
    private _appConfig = AppConfig

    static log = new Logger()

    static instance: Base
    static getInstance<T extends Base>(){
        if(!this.instance){
            this.instance = new this()
        }
        return this.instance as T
    }
    
    get isPackageHub(){
        return process.env['PACKAGE_HUB'] !== undefined
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
        if(process.env.APP_DB_SOURCE){
            this._dbConfig.RepositorySource = process.env.APP_DB_SOURCE
        }
        return this._dbConfig
    }

    get appConfig(){
        if(process.env.APP_KEY){
            this._appConfig.AppKey = process.env.APP_KEY
        }
        if(process.env.APP_SECRET){
            this._appConfig.AppSecret = process.env.APP_SECRET
        }
        if(process.env.GITHUB_TOKEN){
            this._appConfig.GithubToken = process.env.GITHUB_TOKEN
        }
        return this._appConfig
    }

    get log(){
        return Base.log
    }
}