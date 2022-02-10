declare type Callback = ()=>Promise<any>

declare interface ServerConfig {
    host: string
    port: number
}

interface IRepository {
    init(args?:any): void
    findById(id: string): Promise<Module>
    findByName?(name: string): Promise<Module>
    add(module: Module): Promise<Module>
    update(id: string, module: updateModule): Promise<Module>
    update(name: string, module: updateModule): Promise<Module>
    delete(id: string): Promise<void>
    deleteByName?(name: string): Promise<void>
    deletePackageByIndex(module: Module, index:number): Promise<void>
    all(): Promise<Module[]>
}