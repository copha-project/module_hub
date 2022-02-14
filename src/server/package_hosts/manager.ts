import BaseManager from "../../class/manager"
import { getRepository } from "../../repository"
import { AppError, NotFoundError } from "../../class/error"
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
        return this.db.findByName!(name)
    }

    public async findById(id: string): Promise<PackageHost> {
        return this.db.findById(id)
    }

    public async create(host: PackageHost): Promise<PackageHost> {
        const queryList = await this.db.findArrBy(host.host,'host')
        if(queryList.length > 0) throw new AppError("the host is existed!")
        
        host.id = randomUUID()
        await this.db.add<PackageHost>(host)
        return host
    }

    public async update(host: PackageHost, updateHost: PackageHost): Promise<PackageHost> {
        if(updateHost.protocol && updateHost.protocol !== host.protocol) host.protocol = updateHost.protocol
        if(updateHost.host && updateHost.host !== host.host) host.host = updateHost.host
        if(updateHost.port && updateHost.port !== host.port) host.port = updateHost.port
        if(updateHost.api && updateHost.api !== host.api) host.api = updateHost.api

        await this.db.update(host)
        return host
    }

    public async delete(id: string): Promise<void> {
        return this.db.delete(id)
    }

    public async all() {
        return this.db.all<PackageHost>()
    }

    private buildUrl(options: PackageHost){
        const {protocol,host,port,api} = options
        return `${ protocol || 'http' }://${ host }${ port ? port === 80 ? '' : ':' + port : '' }`
    }
}

export const getManager = () => Manager.getInstance<Manager>()
export const getPackageHostManager = getManager