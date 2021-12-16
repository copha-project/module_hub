import { Module } from "./model"
import { readJsonSync, arrayRemove } from 'uni-utils'
import Base from "../../class/base"
import path from "path"
import Manager from "../../class/manager"

interface Repository {
    findByName(name:string): Promise<Module|undefined>
    add(module:Module): Promise<Module|void>
    delete(id:string): Promise<boolean>
    all(): Promise<Module[]>
}

export class LocalRepository extends Base implements Repository {
    private db: Module[] = []
    static instance: LocalRepository
    static getInstance(){
        if(!this.instance){
            this.instance = new LocalRepository
            this.instance.init()
        }
        return this.instance
    }

    init(filePath?:string){
        this.db = readJsonSync(filePath|| this.dbFilePath)
    }

    async findByName(name:string): Promise<Module|undefined> {
        return this.db.find(e=>e.name === name)
    }

    async add(module:Module): Promise<Module> {
        this.db.push(module)  
        return module
    }

    async update(module:Module): Promise<void> {

    }

    async delete(id:string): Promise<boolean>{
        const index = this.db.findIndex(e=>e.id === id)
        if(index === -1) return false
        this.db.splice(index,1)
        return true
    }

    async all(): Promise<Module[]> {
        return this.db
    }

    private get dbFilePath(){
        return path.join(this.publicPath,'modules.json')
    }
}

export class ModuleManager extends Manager{
  private repo = LocalRepository.getInstance()

  public async findByName(name: string): Promise<Module|undefined> {
    return this.repo.findByName(name)
  }

  public async create(module: Module): Promise<Module|void> {
    return this.repo.add(module)
  }

  public async delete(id: string): Promise<boolean> {
    return this.repo.delete(id)
  }

  public async all(){
      return this.repo.all()
  }

}