import Base from "./base"
import Koa from 'koa'
import cors from '@koa/cors'
import Compose from 'koa-compose'
import Router from "@koa/router"
import { reqLog, errorHandler, reply } from '../server/middlewares'
import { init as loadPackageHosts } from '../server/package_hosts'
import { init as loadModules } from '../server/modules'
import { loadHome } from '../server/home'
import { getManager } from "../server/modules/manager"
export default class Server extends Base {
    private app: Koa
    private appRouter = new Router()
    private apiRouter = new Router({
        prefix: '/api/v1'
    })

    constructor(){
        super()
        this.log.debug('init Server')
        this.app = new Koa()
        this.app.context.appConfig = this.appConfig
        this.app.context.log = this.log
    }

    async init(){
        this.app
        .use(Compose([reqLog, reply, errorHandler]))
        .use(cors())
        
        loadHome(this.appRouter)
        loadPackageHosts(this.apiRouter)
        
        

        if(!this.isPackageHub){
            this.log.info('Service mode: meta hub')
            await getManager().loadModulesData()
            loadModules(this.apiRouter)
        }else{
            this.log.info('Service mode: package hub')
        }
        this.apiRouter.get('api','/', ctx=>ctx.body = "api service")
        this.appRouter.use(this.apiRouter.routes())
        this.app.use(this.appRouter.routes())
    }
    
    async launch() {
        await this.init()
        this.app.listen(this.serverConfig.port)
        console.log(`The API server is running at : ${this.serverConfig.host}:${this.serverConfig.port}`)
    }
}