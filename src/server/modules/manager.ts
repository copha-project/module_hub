import { Module, ModuleModel, AddPackage, UpdateModule } from "./model"
import Manager from "../../class/manager"
import { getRepository } from "./repository"
import { NotFoundError, DataRepeatError } from "../../class/error"
export class ModuleManager extends Manager {
    private repo!: IRepository

    async loadModulesData(){
        this.log.info(`Load Modules data from : ${this.dbConfig.RepositorySource}`)
        this.repo = getRepository(this.dbConfig.RepositorySource)
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
        return this.repo.update!(module.name, updateModule)
    }

    public async delete(name: string): Promise<void> {
        return this.repo.deleteByName!(name)
    }

    public async all() {
        return this.repo.all()
    }

    public async addPackage(module: Module, modulePackage: AddPackage){
        if(module.packages?.findIndex(e=>e.version === modulePackage.version) !== -1) throw new DataRepeatError("add package existed")
        const updateModule: UpdateModule = {}
        updateModule.packages = module.packages?.concat(modulePackage)
        await this.repo.update(module.name, updateModule)
        return modulePackage
    }

    public async removePackageByVersion(module: Module, version:string){
        const deleteIndex = module.packages!.findIndex(e=>e.version === version)
        if(deleteIndex === -1) throw new NotFoundError("no package found")
        await this.repo.deletePackageByIndex(module, deleteIndex)
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
                return this.repo.update!(name,updateModule)
            }else{
                throw error
            }
        }
    }
}

export const getManager = () => ModuleManager.getInstance<ModuleManager>()
export const getModuleManager = getManager