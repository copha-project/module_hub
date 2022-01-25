export interface AddModule {
    id?: string
    name: string
    desc: string
    type: string
    repository: string
    packages?: packageItem[]
}

export interface AddPackage extends packageItem {}

export interface UpdateModule {
    id?:string
    desc?: string
    repository?: string
    packages?: packageItem[]
}

declare const enum ModuleType {
    Task="task",
    Driver="driver",
    Storage="storage",
    Notification="notification"
}

export interface Module {
    id: string
    name: string
    desc: string
    type: ModuleType
    repository: string
    packages?: packageItem[]
}

interface packageItem {
    version: string
    link: string
    md5: string
    sha1: string
}
export class ModuleModel {
    public id: string
    public name: string
    public desc: string
    public type: string
    public repository: string
    public packages?: packageItem[]

    constructor(module: Module, fullInfo: boolean = false) {
        this.id = module.id
        this.name = module.name
        this.desc = module.desc
        this.type = module.type
        this.repository = module.repository
        
        if(fullInfo){
            this.packages = module.packages
        } 
    }
}