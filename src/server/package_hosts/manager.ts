import BaseManager from "../../class/manager"
import { getRepository } from "../../repository"
import { AppError } from "../../class/error"
import { getCrypto } from '../../class/crypto'
import { PackageHost, PackageHostModel } from "./model"
import { randomUUID } from 'crypto'
export class Manager extends BaseManager {
    protected useDoc = 'packageHosts'

    async loadData(){
        this.log.info(`Load package host data from : ${this.config.dbConfig.RepositorySource}`)
        this.repo = getRepository()
        return this.repo.init()
    }

    public async getFullHost(id: string){
        const host = await this.db.findById<PackageHost>(id)
        return new PackageHostModel(host)
    }

    public async create(host: PackageHost): Promise<PackageHost> {
        const queryList = await this.db.findArrBy(host.host,'host')
        if(queryList.length > 0) throw new AppError("the host is existed!")
        
        host.id = randomUUID()
        host.secret.key = getCrypto().encrypt(Buffer.from(host.secret.key), this.config.keyConfig.AppSecret)
        await this.db.add<PackageHost>(host)
        return host
    }

    public async update(updateHost: PackageHost): Promise<PackageHost> {
        const host = await this.db.findById<PackageHost>(updateHost.id)
        if(!updateHost.protocol && !updateHost.host && !updateHost.port && !updateHost.secret && !updateHost.api){
            return host
        }
        if(updateHost.protocol && updateHost.protocol !== host.protocol) host.protocol = updateHost.protocol
        if(updateHost.host && updateHost.host !== host.host) host.host = updateHost.host
        if(updateHost.port && updateHost.port !== host.port) host.port = updateHost.port
        
        if(updateHost.secret){
            if(updateHost.secret.key){
                const encryptKey = getCrypto().encrypt(Buffer.from(updateHost.secret.key), this.config.keyConfig.AppSecret)
                if(encryptKey !== host.secret.key) host.secret.key = encryptKey
            }
            
            if(updateHost.secret.path && updateHost.secret.path !== host.secret.path){
                host.secret.path = updateHost.secret.path
            }
        }

        if(updateHost.api && updateHost.api !== host.api) host.api = updateHost.api

        await this.db.update(host)
        return host
    }

    public async delete(id: string): Promise<void> {
        const host = await this.db.findById<PackageHost>(id)
        return this.db.delete(host.id)
    }
}

export const getManager = () => Manager.getInstance<Manager>()
export const getPackageHostManager = getManager