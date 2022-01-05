import Base from "./base"
import Koa from 'koa'
import cors from '@koa/cors'
import Compose from 'koa-compose'
import { reqLog, errorHandler } from '../server/middlewares'
import {init as loadModules} from '../server/modules'
import { loadHome } from '../server/home'
import { getManager } from "../server/modules/manager"
export default class Server extends Base {
    private app: Koa

    constructor(){
        super()
        this.log.debug('init Server')
        this.app = new Koa()
        this.app.context.appConfig = this.appConfig
        this.app
        .use(Compose([errorHandler,reqLog]))
        .use(cors())

        loadHome(this.app)
    }

    async init(){
        if(!this.isPackageHub){
            this.log.info('Service mode: mata hub')
            await getManager().loadModulesData()
            loadModules(this.app)
        }else{
            this.log.info('Service mode: package hub')
        }
    }
    
    async launch() {
        await this.init()
        this.app.listen(this.serverConfig.port)
        console.log(`The API server is running at : ${this.serverConfig.host}:${this.serverConfig.port}`)
    }
}