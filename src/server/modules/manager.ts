import { Module, ModuleModel } from "./model"
import Manager from "../../class/manager"
import { getRepository } from "./repository"
export class ModuleManager extends Manager {
    private repo!: Repository

    async loadModulesData(){
        this.log.info(`Load Modules data from : ${this.dbConfig.RepositorySource}`)
        this.repo = getRepository(this.dbConfig.RepositorySource)
        return this.repo.init()
    }

    public async findFullModuleByName(name: string){
        const module = await this.findByName(name)
        if(!module){
            throw new Error('not found')
        }else{
            return ModuleModel.buildFullInfo(module)
        }
    }

    public async findByName(name: string): Promise<Module | undefined> {
        return this.repo.findByName(name)
    }

    public async create(module: Module): Promise<Module | void> {
        return this.repo.add(module)
    }

    public async update(module: Module): Promise<Module | void> {
        return this.repo.update(module)
    }

    public async delete(id: string): Promise<boolean> {
        return this.repo.delete(id)
    }

    public async all() {
        return this.repo.all()
    }
}

export const getManager = () => ModuleManager.getInstance<ModuleManager>()