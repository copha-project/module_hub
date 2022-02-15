export interface AddHost extends PackageHost {}
export interface PackageHost {
    id: string
    protocol: string
    host: string
    port: number
    api: {
        upload: string
        package: string
    }
}

export class PackageHostModel {
    public id: string
    public protocol: string
    public host: string
    public port: number
    public api: {
        upload: string
        package: string
    }
    public uploadPoint: string
    public fetchPoint: string

    constructor(host: PackageHost) {
        this.id = host.id
        this.protocol = host.protocol
        this.host = host.host
        this.port = host.port
        this.api = host.api

        this.uploadPoint = this.buildUrl(host.api.upload)
        this.fetchPoint = this.buildUrl(host.api.package)
    }
    
    private buildUrl(apiPoint: string){
        let url = `${this.protocol}://${ this.host }:${this.port}`

        if(this.protocol === 'http' && this.port === 80){
            url = `http://${ this.host }`
        }
        if(this.protocol === 'https' && this.port === 443){
            url = `https://${ this.host }`
        }
        url += apiPoint
        return url
    }
}