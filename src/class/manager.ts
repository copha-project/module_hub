import Base from './base'
import Repository from './repository'

export default class Manager extends Base {
    protected repo!: Repository
    protected useDoc = ''

    get db(){
        return this.repo.use(this.useDoc)
    }

    public async findByName<T>(name: string): Promise<T> {
        return this.db.findByName(name)
    }

    public async findById<T>(id: string): Promise<T> {
        return this.db.findById(id)
    }

    public async all<T>() {
        return this.db.all<T>()
    }
}