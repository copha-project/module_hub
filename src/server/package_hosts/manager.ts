import BaseManager from "../../class/manager"
import { getRepository } from "../../repository"
import { NotFoundError } from "../../class/error"
import { PackageHost } from "./model"
import { randomUUID } from 'crypto'
export class Manager extends BaseManager {
    protected useDoc = 'packageHosts'

    async loadData(){
        this.log.info(`Load package host data from : ${this.config.dbConfig.RepositorySource}`)
        this.repo = getRepository()
        return this.repo.init()
    }

    public async findByName(name: string): Promise<PackageHost> {
        return this.repo.findByName!(name)
    }

    public async findById(id: string): Promise<PackageHost> {
        return this.repo.findById(id)
    }

    public async create(host: PackageHost): Promise<PackageHost> {
        try {
            await this.db.findBy(host.host,'host')
            throw Error("the host is existed!")
        } catch (error) {
            if((error as Error).message === this.repo.errors.itemNotFound.message){
                host.id = randomUUID()
                await this.db.add<PackageHost>(host)
                return host
            }else{
                throw error
            }
        }
    }

    public async update(module: PackageHost, updateModule: PackageHost): Promise<PackageHost> {
        return this.repo.update(updateModule)
    }

    public async delete(name: string): Promise<void> {
        return this.repo.deleteByName!(name)
    }

    public async all() {
        return this.repo.use(this.useDoc).all<PackageHost>()
    }

    private buildUrl(options: PackageHost){
        const {protocol,host,port,api} = options
        return `${ protocol || 'http' }://${ host }${ port ? port === 80 ? '' : ':' + port : '' }`
    }
}

export const getManager = () => Manager.getInstance<Manager>()
export const getPackageHostManager = getManager