import Base from "./base"
import Koa from 'koa'
import Compose from 'koa-compose'
import { reqLog, errHandler } from '../server/middlewares'

import {init as moduleInit} from '../server/modules'

declare interface ServerConfig {
    host: string
    port: number
}

export default class Server extends Base {
    static instance: Server
    private app: any

    static getInstance(){
        if(!this.instance){
            this.instance = new this()
            this.instance.init()
        }
        return this.instance
    }

    init(){
        this.log.debug('init Server')
        this.app = new Koa()
        this.app
        .use(Compose([errHandler,reqLog]))
        
        moduleInit(this.app)
        
    }
    launch() {
        this.app.listen(this.serverConfig.port)
    }
}