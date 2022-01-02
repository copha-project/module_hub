import path from "path"
import { readJsonSync } from 'uni-utils'
import { Module } from "../model"
import Repository from "../../../class/repository"

export default class LocalRepository extends Repository implements Repository {
    private db: Module[] = []

    init(filePath?: string) {
        this.db = readJsonSync(filePath || this.dbFilePath)
    }

    async findById(id: string): Promise<Module | undefined> {
        return this.db.find(e => e.id === id)
    }

    async findByName(name: string): Promise<Module | undefined> {
        return this.db.find(e => e.name === name)
    }

    async add(module: Module): Promise<Module> {
        this.db.push(module)
        return module
    }

    async update(name: string,module: Module): Promise<void> {
        throw new Error("not work")
    }

    async delete(id: string): Promise<void> {
        const index = this.db.findIndex(e => e.id === id)
        if (index === -1) return
        this.db.splice(index, 1)
    }

    async all(): Promise<Module[]> {
        return this.db
    }

    private get dbFilePath() {
        return path.join(this.publicPath, 'modules.json')
    }
}