import Base from './base'
import Repository from './repository'

export default class Manager extends Base {
    protected repo!: Repository
    protected useDoc = ''

    get db(){
        return this.repo.use(this.useDoc)
    }
}