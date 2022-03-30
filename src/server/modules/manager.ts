import { randomUUID } from 'crypto'
import { Module, AddPackage } from "./model"
import Manager from "../../class/manager"
import { getRepository } from "../../repository"
import { AppError, NotFoundError, DataRepeatError } from "../../class/error"
import { sample } from 'lodash'
import { PackageHost } from "../package_hosts/model"
export class ModuleManager extends Manager {
    protected useDoc = 'modules'

    async loadData(){
        this.log.info(`Load Modules data from : ${this.config.dbConfig.RepositorySource}`)
        this.repo = getRepository()
        return this.repo.init()
    }

    public async create(module: Module): Promise<Module> {
        const packageHosts = await this.db.use('packageHosts').all<PackageHost>()
        if(!packageHosts.length) throw new AppError("not get a module package host")

        const queryList = await this.db.findArrBy(module.name, 'name')
        if(queryList.length > 0) throw new AppError("the module is existed!")
        
        module.id = randomUUID()
        module.packageHost = sample(packageHosts)?.id
        module.packages = []
        return this.db.add<Module>(module)
    }

    public async update(updateModule: Module): Promise<Module> {
        const module = await this.db.findById<Module>(updateModule.id)
        
        if(!updateModule.desc && !updateModule.repository) return module
        if(updateModule.desc === module.desc && updateModule.repository === module.repository) return module
        
        if(updateModule.desc && updateModule.desc !== module.desc) module.desc = updateModule.desc
        if(updateModule.repository && updateModule.repository !== module.repository) module.repository = updateModule.repository

        await this.db.update(module)
        return module
    }

    public async delete(id: string): Promise<void> {
        const module = await this.db.findById<Module>(id)
        return this.db.delete(module.id)
    }

    public async getPackage(moduleId: string, ver: string){
        const module = await this.findById<Module>(moduleId)
        const packageItem = module.packages?.find(e=>e.version === ver)
        if(!packageItem) throw new NotFoundError("no package found")
        packageItem.module_id = module.id
        packageItem.package_host = module.packageHost
        return packageItem
    }

    public async addPackage(module: Module, modulePackage: AddPackage){
        if(module.packages?.findIndex(e=>e.version === modulePackage.version) !== -1) throw new DataRepeatError("version already exists")
        module.packages.push(modulePackage)
        await this.db.update(module)
        return modulePackage
    }

    public async removePackageByVersion(module: Module, version: string){
        const deleteIndex = module.packages!.findIndex(e=>e.version === version)
        if(deleteIndex === -1) throw new NotFoundError("no package found")
        module.packages = module.packages?.filter(e=>e.version !== version)
        await this.db.update(module)
    }

    public async resetId(id: string, replace_id: string){
        if(id === replace_id) throw new AppError("id not change")
        let module = await this.findById<Module>(id)
        module.id = replace_id
        await this.repo.update(module, 'name')
    }
}

export const getManager = () => ModuleManager.getInstance<ModuleManager>()
export const getModuleManager = getManager