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
    packageHost?: string
}

interface packageItem {
    version: string
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
    public packageHost?: string
    public vers: number

    constructor(module: Module) {
        this.id = module.id
        this.name = module.name
        this.desc = module.desc
        this.type = module.type
        this.repository = module.repository
        this.packageHost = module.packageHost
        this.vers = module.packages?.length || 0
    }

    static createFullModule(module: Module){
        const moduleItem = new ModuleModel(module)
        moduleItem.packages = module.packages
        return moduleItem
    }
}