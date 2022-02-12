declare type Callback = ()=>Promise<any>

declare interface ServerConfig {
    host: string
    port: number
}

interface IRepository {
    init(args?:any): void
    use(doc:string): this
    findById(id: string): Promise<Module>
    findByName?(name: string): Promise<Module>
    add<T>(item: T): Promise<T>
    update(item:any, key?:string): Promise<Module>
    delete(id: string): Promise<void>
    deleteByName?(name: string): Promise<void>
    all<T>(): Promise<T[]>
}