import Utils from 'uni-utils'
import Repository from "../../../class/repository"
import { Module } from "../model"

export default class RemoteRepository extends Repository implements Repository {
    private db: Module[] = []
  
    async init(){
        try {
            await super.loadStorageList()
            const modulesData = await Utils.download(this.dbConfig.RemoteSource,{})
            this.db = JSON.parse(Buffer.from(JSON.parse(modulesData).content,'base64').toString('utf-8'))
        } catch (error:any) {
            this.log.err(`get db error: ${error.message}`)
        }
    }

    findByName(name: string): Promise<Module | undefined> {
        return Promise.resolve(this.db.find(e=>e.name === name))
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