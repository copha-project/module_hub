export interface AddModule {
    name: string
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
    sha256: string
}
export class ModuleModel {
    public id: string
    public name: string
    public desc: string
    public type: string
    public repository: string
    public packages?: packageItem[]

    constructor(module: Module) {
        this.id = module.id
        this.name = module.name
        this.desc = module.desc
        this.type = module.type
        this.repository = module.repository
        this.packages = module.packages
    }

    static buildFullInfo(module: Module){
        const m = new this(module)
        m.packages = []
        return m
    }
}