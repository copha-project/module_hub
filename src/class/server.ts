import Base from "./base"
import Koa from 'koa'
import Compose from 'koa-compose'
import { reqLog, errorHandler } from '../server/middlewares'

import {init as moduleInit} from '../server/modules'

declare interface ServerConfig {
    host: string
    port: number
}

export default class Server extends Base {
    private app: Koa
    constructor(){
        super()
        this.log.debug('init Server')
        this.app = new Koa()
        this.app
        .use(Compose([errorHandler,reqLog]))
        moduleInit(this.app)
    }

    launch() {
        this.app.listen(this.serverConfig.port)
        console.log(`The API server is running at : ${this.serverConfig.host}:${this.serverConfig.port}`)
    }
}