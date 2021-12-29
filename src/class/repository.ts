import Base from "./base"
import Utils from 'uni-utils'

export default class Repository extends Base {
    protected storageList = []

    async loadStorageList(){
        try {
            const storageData = await Utils.download(this.dbConfig.StorageSource,{})
            this.storageList = JSON.parse(Buffer.from(JSON.parse(storageData).content,'base64').toString('utf-8'))
        } catch (error:any) {
            this.log.err(`loadStorageList error: ${error.message}`)
        }
    }

    protected getPackageStorageLink(){
        return this.buildUrl(this.storageList[0])
    }

    private buildUrl(options: { schema: any; host: any; port: any; namespace: any }){
        const {schema,host,port,namespace} = options
        return `${ schema || 'http' }://${ host }${ port ? ':' + port : '' }/${ namespace ? namespace + '/' : '' }`
    }
}