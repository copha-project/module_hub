import Base from "./base"
import { NotFoundError } from './error'
import { Module } from '../server/modules/model'
import Utils from 'uni-utils'
export default class Repository extends Base {
    protected storageList = []
    protected db!: Module[]

    public async all(): Promise<unknown[]> {
        return this.db
    }

    async findById(id: string): Promise<unknown> {
        const module = this.db.find(e=>e.id === id)
        if(!module) throw new NotFoundError("module not found")
        return module
    }

    async findByName(name: string): Promise<unknown> {
        const module = this.db.find(e=>e.name === name)
        if(!module) throw new NotFoundError("module not found")
        return module
    }

    async add(module: Module): Promise<void> {
        const cloneDb: Module[] = Object.assign([],this.db)
        cloneDb.push(module)
        await this.sync(this.content2b(cloneDb),`add module: ${module.name}`)
        this.db = cloneDb
    }

    async update(name: string, updateModule: Module){
        const cloneDb: Module[] = Object.assign([],this.db)
        const cloneModule = cloneDb.find(e=>e.name === name)!
    
        if(updateModule.id) cloneModule.id = updateModule.id
        if(updateModule.desc) cloneModule.desc = updateModule.desc
        if(updateModule.repository) cloneModule.repository = updateModule.repository

        if(updateModule.packages) cloneModule.packages = updateModule.packages

        await this.sync(this.content2b(cloneDb), `update module: ${name}`)
        this.db = cloneDb
        return cloneModule
    }

    async delete(id: string): Promise<void> {
        const index = this.db.findIndex(e => e.id === id)
        return this.deleteByIndex(index)
    }

    async deleteByName(name: string): Promise<void> {
        const index = this.db.findIndex(e => e.name === name)
        return this.deleteByIndex(index)
    }
    
    protected async deleteByIndex(index:number){
        if (index === -1) {
            this.log.info("no module found!")
            return
        }
        const cloneDb: Module[] = Object.assign([],this.db)
        const deletedItem = cloneDb.splice(index, 1)
        const msg = "remove module: " + deletedItem.map(e=>e.name).join(" ")
        await this.sync(this.content2b(cloneDb), msg)
        this.db.splice(index, 1)
    }

    async deletePackageByIndex(module:Module,index:number){
        const cloneDb: Module[] = Object.assign([],this.db)
        const useModule = cloneDb.find(e=>e.id === module.id)!
        const deletedItem = useModule.packages!.splice(index, 1)
        const msg = "remove module package : " + useModule.name + ':' + deletedItem.map(e=>e.version).join(" ")
        await this.sync(this.content2b(cloneDb), msg)
        this.db.find(e=>e.id === module.id)!.packages?.splice(index,1)
    }

    protected async sync(db:string, msg?:string){
        this.log.info("sync: " + msg)
    }

    // inner method
    protected content2b(data:unknown){
        return Buffer.from(JSON.stringify(data, undefined, 4)).toString('base64')
    }

    protected content2o(data:string){
        return JSON.parse(Buffer.from(data,'base64').toString('utf-8'))
    }

    async loadStorageList(){
        try {
            const storageData = await Utils.download(this.config.dbConfig.StorageSource,{})
            this.storageList = JSON.parse(Buffer.from(JSON.parse(storageData).content,'base64').toString('utf-8'))
        } catch (error:any) {
            this.log.err(`loadStorageList error: ${error.message}`)
        }
    }

    public async getPackageStorageLink(){
        if(!this.storageList.length) await this.loadStorageList()
        return this.storageList.map(this.buildUrl)
    }

    private buildUrl(options: { schema: any; host: any; port: any; namespace: any }){
        const {schema,host,port,namespace} = options
        return `${ schema || 'http' }://${ host }${ port ? ':' + port : '' }${ namespace ? '/' + namespace : '' }`
    }
}