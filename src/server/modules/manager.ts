import { Module } from "./model"
import { readJsonSync, arrayRemove } from 'uni-utils'
import Base from "../../class/base"
import path from "path"
import Manager from "../../class/manager"
import Utils from 'uni-utils'

interface Repository {
    init(args?:any): void
    findByName(name: string): Promise<Module | undefined>
    add(module: Module): Promise<Module | void>
    delete(id: string): Promise<boolean>
    all(): Promise<Module[]>
}

export class LocalRepository extends Base implements Repository {
    private db: Module[] = []
    static instance: LocalRepository
    static getInstance() {
        if (!this.instance) {
            this.instance = new LocalRepository
            this.instance.init()
        }
        return this.instance
    }

    init(filePath?: string) {
        this.db = readJsonSync(filePath || this.dbFilePath)
    }

    async findByName(name: string): Promise<Module | undefined> {
        return this.db.find(e => e.name === name)
    }

    async add(module: Module): Promise<Module> {
        this.db.push(module)
        return module
    }

    async update(module: Module): Promise<void> {

    }

    async delete(id: string): Promise<boolean> {
        const index = this.db.findIndex(e => e.id === id)
        if (index === -1) return false
        this.db.splice(index, 1)
        return true
    }

    async all(): Promise<Module[]> {
        return this.db
    }

    private get dbFilePath() {
        return path.join(this.publicPath, 'modules.json')
    }
}

class RemoteRepository extends Base implements Repository {
    private db: Module[] = []
    static getInstance(){
        return super.getInstance() as RemoteRepository
    }

    async init(){
        const url = "https://api.github.com/repos/copha-project/module/contents/modules.json"
        const modulesData = await Utils.download(url,{})
        const jsonData = JSON.parse(Buffer.from(JSON.parse(modulesData).content,'base64').toString('utf-8'))
        this.db = jsonData
    }

    findByName(name: string): Promise<Module | undefined> {
        throw new Error("Method not implemented.")
    }
    add(module: Module): Promise<void | Module> {
        throw new Error("Method not implemented.")
    }
    delete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.")
    }
    async all(): Promise<Module[]> {
        return this.db
    }
}

export class ModuleManager extends Manager {
    private repo: Repository = LocalRepository.getInstance()

    static getInstance(){
        return super.getInstance() as ModuleManager
    }

    static async loadModulesData(){
        this.getInstance().repo = RemoteRepository.getInstance()
        return this.getInstance().repo.init()
    }

    public async findByName(name: string): Promise<Module | undefined> {
        return this.repo.findByName(name)
    }

    public async create(module: Module): Promise<Module | void> {
        return this.repo.add(module)
    }

    public async delete(id: string): Promise<boolean> {
        return this.repo.delete(id)
    }

    public async all() {
        return this.repo.all()
    }

}