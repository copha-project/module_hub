import Base from "./base"
import Koa from 'koa'
import Cors from '@koa/cors'
import Compose from 'koa-compose'
import { reqLog, catchError, reply } from '../middlewares'
import { getManager } from "../server/modules/manager"
import { getPackageHostManager } from "../server/package_hosts/manager"
import { getRoutes } from '../routes'
export default class Server extends Base {
    private app: Koa

    constructor(){
        super()
        this.log.debug('init Server')
        this.app = new Koa()
        this.app.context.appConfig = this.config.appConfig
        this.app.context.log = this.log
    }

    async init(){
        this.app
        .use(Compose([reqLog, reply, catchError]))
        .use(Cors())

        if(!this.config.isPackageHub){
            this.log.info('Service mode: meta hub')
            await getManager().loadData()
            await getPackageHostManager().loadData()
        }else{
            this.log.info('Service mode: package hub')
        }

        this.app.use(getRoutes())
    }
    
    async launch() {
        await this.init()
        this.app.listen(this.config.serverConfig.port)
        console.log(`The API server is running at : ${this.config.serverConfig.host}:${this.config.serverConfig.port}`)
    }
}