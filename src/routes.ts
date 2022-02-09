import Base from "./class/base";
import Router from "@koa/router"
import { init as loadPackageHosts } from './server/package_hosts'
import { init as loadModules } from './server/modules'
import { loadHome } from './server/home'

export default class Routes extends Base{
    private appRouter = new Router()
    private apiRouter = new Router({
        prefix: '/api/v1'
    })
    constructor(){
        super()
        loadHome(this.appRouter)
        loadPackageHosts(this.apiRouter)
        if(!this.isPackageHub){
            loadModules(this.apiRouter)
        }

        this.apiRouter.get('api','/', ctx=>ctx.body = "api service")
        this.appRouter.use(this.apiRouter.routes())
    }

    get routes(){
        return this.appRouter.routes()
    }
}

export function getRoutes(){
    return Routes.getInstance<Routes>().routes
}