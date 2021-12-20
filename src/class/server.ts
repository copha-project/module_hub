import Base from "./base"
import Koa from 'koa'
import Compose from 'koa-compose'
import { reqLog, errorHandler } from '../server/middlewares'

import {init as loadModules} from '../server/modules'
import { loadHome } from '../server/home'
import { ModuleManager } from "../server/modules/manager"
export default class Server extends Base {
    private app: Koa
    
    static getInstance(){
        return super.getInstance() as Server
    }

    constructor(){
        super()
        this.log.debug('init Server')
        this.app = new Koa()
        this.app
        .use(Compose([errorHandler,reqLog]))

        loadHome(this.app)
        loadModules(this.app)
    }

    async init(){
        this.log.info("load Modules data")
        await ModuleManager.loadModulesData()
    }
    
    async launch() {
        await this.init()
        this.app.listen(this.serverConfig.port)
        console.log(`The API server is running at : ${this.serverConfig.host}:${this.serverConfig.port}`)
    }
}