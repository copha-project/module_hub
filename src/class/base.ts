import path from 'path'
import { ServerConfig, DBConfig } from '../config'
import Logger from './logger'

export default class Base {
    private _serverConfig = ServerConfig
    private _dbConfig = DBConfig

    static log = new Logger()

    get publicPath(){
        return path.join(__dirname,'../public')
    }

    get serverConfig(){
        return this._serverConfig
    }

    get dbConfig(){
        return this._dbConfig
    }

    get log(){
        return Base.log
    }
}