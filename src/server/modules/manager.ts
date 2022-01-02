import { Module, ModuleModel, AddPackage, UpdateModule } from "./model"
import Manager from "../../class/manager"
import { getRepository } from "./repository"
import { NotFoundError } from "../../class/error"
export class ModuleManager extends Manager {
    private repo!: Repository

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
        return this.repo.add(module)
    }

    public async update(name: string, module: UpdateModule): Promise<Module | void> {
        return this.repo.update!(name, module)
    }

    public async delete(id: string): Promise<boolean> {
        return this.repo.delete(id)
    }

    public async all() {
        return this.repo.all()
    }

    public async addPackage(module: Module, modulePackage: AddPackage){
        const updateModule: UpdateModule = {}
        updateModule.packages = module.packages?.concat(modulePackage)
        return this.repo.update!(module.name, updateModule)
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