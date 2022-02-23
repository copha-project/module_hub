import BaseManager from "../../class/manager"
import { getRepository } from "../../repository"
import { AppError } from "../../class/error"
import { PackageHost } from "./model"
import { randomUUID } from 'crypto'
export class Manager extends BaseManager {
    protected useDoc = 'packageHosts'

    async loadData(){
        this.log.info(`Load package host data from : ${this.config.dbConfig.RepositorySource}`)
        this.repo = getRepository()
        return this.repo.init()
    }

    public async create(host: PackageHost): Promise<PackageHost> {
        const queryList = await this.db.findArrBy(host.host,'host')
        if(queryList.length > 0) throw new AppError("the host is existed!")
        
        host.id = randomUUID()
        await this.db.add<PackageHost>(host)
        return host
    }

    public async update(updateHost: PackageHost): Promise<PackageHost> {
        const host = await this.db.findById<PackageHost>(updateHost.id)
        if(updateHost.protocol && updateHost.protocol !== host.protocol) host.protocol = updateHost.protocol
        if(updateHost.host && updateHost.host !== host.host) host.host = updateHost.host
        if(updateHost.port && updateHost.port !== host.port) host.port = updateHost.port
        if(updateHost.api && updateHost.api !== host.api) host.api = updateHost.api

        await this.db.update(host)
        return host
    }

    public async delete(id: string): Promise<void> {
        const host = await this.db.findById<PackageHost>(id)
        return this.db.delete(host.id)
    }

    private buildUrl(options: PackageHost){
        const {protocol,host,port,api} = options
        return `${ protocol || 'http' }://${ host }${ port ? port === 80 ? '' : ':' + port : '' }`
    }
}

export const getManager = () => Manager.getInstance<Manager>()
export const getPackageHostManager = getManager