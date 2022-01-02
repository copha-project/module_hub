interface Repository {
    init(args?:any): void
    findById(id: string): Promise<Module>
    findByName?(name: string): Promise<Module>
    add(module: Module): Promise<Module>
    update(id: string, module: updateModule): Promise<void>
    update?(name: string, module: updateModule): Promise<void>
    delete(id: string): Promise<boolean>
    all(): Promise<Module[]>
}