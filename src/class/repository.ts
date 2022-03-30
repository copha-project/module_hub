import Base from "./base"
interface BaseModel {
    id: string
}

const clone = (obj: any) => JSON.parse(JSON.stringify(obj))
export default class Repository extends Base {
    static errors = {
        noDocSelected : new Error("no doc selected"),
        itemNotFound : new Error("item not found"),
        noData : new Error("not data found"),
        methodNotImplemented : new Error("method not implemented")
    }
    get errors(){
        return Repository.errors
    }

    private db: { [doc: string]: any[] } = {}
    private useDoc!: string

    protected async sync(doc?: any[], msg?: string) {
        throw this.errors.methodNotImplemented
    }

    public async init(){
        throw this.errors.methodNotImplemented
    }

    public use(doc: string) {
        if(!doc) throw this.errors.noDocSelected
        this.useDoc = doc
        return this
    }

    async all<T>(): Promise<Readonly<T[]>> {
        if(!this.db[this.useDoc]) throw this.errors.noData
        return this.db[this.useDoc]
    }

    async findById<T>(id: string): Promise<T> {
        const item = this.currentDoc.find(e => e.id === id)
        if (!item) throw this.errors.itemNotFound
        return clone(item)
    }

    async findArrBy<T>(value: string, key?: string): Promise<Readonly<T[]>> {
        return this.currentDoc.filter(e => e[key||'id'] === value)
    }

    async findBy<T>(value: string, key: string): Promise<T> {
        const item = this.currentDoc.find(e => e[key] === value)
        if (!item) throw this.errors.itemNotFound
        return clone(item)
    }

    async findByName<T>(name: string): Promise<T> {
        const item = this.currentDoc.find(e => e.name === name)
        if (!item) throw this.errors.itemNotFound
        return clone(item)
    }

    async add<T extends BaseModel>(item: T): Promise<T> {
        const cloneDb = clone(this.currentDoc)
        cloneDb.push(item)
        await this.sync(cloneDb, `add item: ${item?.id || JSON.stringify(item)}`)
        this.setCurrentDoc(cloneDb)
        return item
    }

    async update(item: any, key?: string) {
        const itemKey = key || 'id'
        const itemIndex = this.currentDoc.findIndex(e => e[itemKey] === item[itemKey])
        if (itemIndex === -1) throw this.errors.itemNotFound

        const cloneDb: any[] = clone(this.currentDoc)
        cloneDb[itemIndex] = item
        
        await this.sync(cloneDb, `update item: ${item[itemKey]}`)
        this.setCurrentDoc(cloneDb)
        return item
    }

    async delete(id: string): Promise<void> {
        const index = this.currentDoc.findIndex(e => e.id === id)
        return this.deleteByIndex(index)
    }

    async deleteByName(name: string): Promise<void> {
        const index = this.currentDoc.findIndex(e => e.name === name)
        return this.deleteByIndex(index)
    }

    private async deleteByIndex(index: number) {
        if (index === -1) {
            this.log.info("no item found!")
            return
        }
        const cloneDb = clone(this.currentDoc)
        const deletedItem = cloneDb.splice(index, 1)
        const msg = "remove item: " + deletedItem.map((e: any) => e.name || e.id).join(" ")
        await this.sync(cloneDb, msg)
        this.currentDoc.splice(index, 1)
    }

    get currentDocName(){
        return this.useDoc
    }

    get currentDoc() {
        return this.db[this.useDoc] || []
    }

    protected setCurrentDoc<T>(data: T[]) {
        this.db[this.useDoc] = data
    }
}