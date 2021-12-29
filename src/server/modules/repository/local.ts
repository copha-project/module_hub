import path from "path"
import { readJsonSync } from 'uni-utils'
import { Module } from "../model"
import Repository from "../../../class/repository"

export default class LocalRepository extends Repository implements Repository {
    private db: Module[] = []

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