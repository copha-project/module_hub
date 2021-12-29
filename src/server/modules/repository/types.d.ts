interface Repository {
    init(args?:any): void
    findByName(name: string): Promise<Module | undefined>
    add(module: Module): Promise<Module | void>
    update(module: Module): Promise<void>
    delete(id: string): Promise<boolean>
    all(): Promise<Module[]>
}