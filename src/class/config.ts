import path from 'path'
import { ServerConfig, DBConfig, KeyConfig } from '../config'

export default class Config{

    static instance: Config
    static getInstance<T extends Config>(){
        if(!this.instance){
            this.instance = new this()
        }
        return this.instance as T
    }

    private _serverConfig = ServerConfig
    private _dbConfig = DBConfig
    private _keyConfig = KeyConfig

    get isPackageHub(){
        return process.env.PACKAGE_HUB !== undefined
    }

    get publicPath(){
        return process.env.APP_PUBLIC_PATH || path.join(this.appRootPath,'./public')
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
        return path.join(__dirname,'../')
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
}

export const getConfig = () => Config.getInstance<Config>()