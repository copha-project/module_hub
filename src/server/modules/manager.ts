import { Module, AddPackage, UpdateModule } from "./model"
import Manager from "../../class/manager"
import { getRepository } from "../../repository"
import { AppError, NotFoundError } from "../../class/error"
import { sample } from 'lodash'
import { PackageHost } from "../package_hosts/model"
export class ModuleManager extends Manager {
    protected useDoc = 'modules'

    async loadData(){
        this.log.info(`Load Modules data from : ${this.config.dbConfig.RepositorySource}`)
        this.repo = getRepository()
        return this.repo.init()
    }

    public async findByName(name: string): Promise<Module> {
        return this.repo.findByName!(name)
    }

    public async findById(id: string): Promise<Module> {
        return this.repo.findById(id)
    }

    public async create(module: Module): Promise<Module> {
        try {
            const packageHosts = await this.repo.use('packageHosts').all<PackageHost>()
            if(!packageHosts.length) throw new AppError("not get a package host")
            module.packageHost = sample(packageHosts)?.id
            await this.repo.findByName!(module.name)
            throw Error("the module name is existed!")
        } catch (error) {
            if(error instanceof NotFoundError){
                await this.repo.add(module)
                return module
            }else{
                throw error
            }
        }
    }

    public async update(module: Module, updateModule: UpdateModule): Promise<Module> {
        if(!updateModule.desc && !updateModule.repository) return module
        if(updateModule.desc === module.desc && updateModule.repository === module.repository) return module
        
        if(updateModule.id) module.id = updateModule.id
        if(updateModule.desc) module.desc = updateModule.desc
        if(updateModule.repository) module.repository = updateModule.repository

        if(updateModule.packages) module.packages = updateModule.packages

        return this.repo.update(updateModule)
    }

    public async delete(name: string): Promise<void> {
        return this.repo.deleteByName!(name)
    }

    public async all() {
        return this.repo.use(this.useDoc).all<Module>()
    }

    public async addPackage(module: Module, modulePackage: AddPackage){
        // if(module.packages?.findIndex(e=>e.version === modulePackage.version) !== -1) throw new DataRepeatError("version already exists")
        // const updateModule: UpdateModule = {}
        // updateModule.packages = module.packages?.concat(modulePackage)
        // await this.repo.update(module.name, updateModule)
        // return modulePackage
    }

    public async removePackageByVersion(module: Module, version:string){
        // const deleteIndex = module.packages!.findIndex(e=>e.version === version)
        // if(deleteIndex === -1) throw new NotFoundError("no package found")
        // await this.repo.deletePackageByIndex(module, deleteIndex)
    }

    async deletePackageByIndex(module:Module,index:number){
        // const cloneDb: Module[] = Object.assign([],this.db)
        // const useModule = cloneDb.find(e=>e.id === module.id)!
        // const deletedItem = useModule.packages!.splice(index, 1)
        // const msg = "remove module package : " + useModule.name + ':' + deletedItem.map(e=>e.version).join(" ")
        // await this.repo.sync(cloneDb, msg)
        // this.db.find(e=>e.id === module.id)!.packages?.splice(index,1)
    }

    public async resetId(name:string, id:string){
        let module = await this.findByName(name)
        if(module.id === id) {
            this.log.info('id not change')
            return
        }

        try {
            await this.findById(id)
            throw Error("the id is used!")
        } catch (error) {
            if(error instanceof NotFoundError){
                const updateModule: UpdateModule = {}
                updateModule.id = id
                return this.repo.update(updateModule, 'name')
            }else{
                throw error
            }
        }
    }

    private buildUrl(options: PackageHost){
        const {protocol,host,port,api} = options
        return `${ protocol || 'http' }://${ host }${ port ? port === 80 ? '' : ':' + port : '' }`
    }
}

export const getManager = () => ModuleManager.getInstance<ModuleManager>()
export const getModuleManager = getManager