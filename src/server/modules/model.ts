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
    name: string;
    desc: string;
    type: ModuleType;
    repository?: string;
    version: string;
}

export class ModuleModel {
    public name: string
    public desc: string
    public type: string
    public repository: string
    public version: string

    constructor(module: Module) {
        this.name = module.name
        this.desc = module.desc
        this.type = module.type
        this.repository = module.repository!
        this.version = module.version
    }
}