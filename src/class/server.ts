import path from 'path'
import Base from "./base"
import Koa from 'koa'
import favicon from 'koa-favicon'
import Cors from '@koa/cors'
import Compose from 'koa-compose'
import Utils from 'uni-utils'
import { reqLog, catchError, reply } from '../middlewares'
import { getModuleManager } from "../server/modules/manager"
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
        await this.checkServerFile()
        this.app
        .use(favicon(this.config.faviconPath))
        .use(Compose([reqLog, reply, catchError]))
        .use(Cors())
        console.log("env:",process.env);

        if(this.config.isPackageHub){
            this.log.info('Service mode: package hub')
        }else{
            this.log.info('Service mode: meta hub')
            await getModuleManager().loadData()
            await getPackageHostManager().loadData()
        }

        this.app.use(getRoutes())
    }

    async launch() {
        await this.init()
        this.app.listen(this.config.serverConfig.port)
        console.log(`The API server is running at : ${this.config.serverConfig.host}:${this.config.serverConfig.port}`)
    }

    private async checkServerFile(){
        if(! await Utils.checkFile(this.config.publicPath)){
            await Utils.createDir(this.config.publicPath)
        }
        if(! await Utils.checkFile(this.config.packageStoragePath)){
            await Utils.createDir(this.config.packageStoragePath)
        }
        // create favicon
        if(! await Utils.checkFile(this.config.faviconPath)){
            await Utils.download('https://copha.net/favicon.ico',{
                savePath: this.config.faviconPath,
                decoding: ''
            })
        }

        if(this.dataSource.isLocal){
            for (const doc of this.config.dbConfig.Doc) {
                const docFile = path.join(this.config.publicPath,`${doc}.json`)
                if(! await Utils.checkFile(docFile)){
                    await Utils.saveFile('[]',docFile)
                }
            }
        }
    }
}

export const getServer = () => Server.getInstance<Server>()
