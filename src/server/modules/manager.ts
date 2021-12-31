import { Module, ModuleModel, AddPackage, UpdateModule } from "./model"
import Manager from "../../class/manager"
import { getRepository } from "./repository"
export class ModuleManager extends Manager {
    private repo!: Repository

    async loadModulesData(){
        this.log.info(`Load Modules data from : ${this.dbConfig.RepositorySource}`)
        this.repo = getRepository(this.dbConfig.RepositorySource)
        return this.repo.init()
    }

    public async findByName(name: string): Promise<Module> {
        return this.repo.findByName(name)
    }

    public async create(module: Module): Promise<Module> {
        return this.repo.add(module)
    }

    public async update(name: string, module: UpdateModule): Promise<Module | void> {
        module.packages = []
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
}

export const getManager = () => ModuleManager.getInstance<ModuleManager>()