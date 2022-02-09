import Base from "./class/base"
import Router from "@koa/router"
import { getRoutes as getPackageHostsRoutes } from './server/package_hosts'
import { getRoutes as getModulesRoutes } from './server/modules'
import { getRoutes as getHomeRoutes } from './server/home'

export default class Routes extends Base{
    private appRouter = new Router()
    private apiRouter = new Router({
        prefix: '/api/v1'
    })
    constructor(){
        super()
        this.appRouter.use(getHomeRoutes())
        
        if(!this.isPackageHub){
            this.appRouter.use(getPackageHostsRoutes())
            this.apiRouter.use(getModulesRoutes())
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