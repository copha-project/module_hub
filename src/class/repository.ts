import Base from "./base"

const itemNotFound = new Error("item not found")
const noData = new Error("not data found")
const methodNotImplemented = new Error("method not implemented")
export default class Repository extends Base {
    private db: { [doc: string]: any[] } = {}
    private useDoc!: string

    protected async sync(doc?: any[], msg?: string) {
        throw methodNotImplemented
    }

    public use(doc: string) {
        this.useDoc = doc
        return this
    }

    async all<T>(): Promise<T[]> {
        if(!this.db[this.useDoc]) throw noData
        return this.db[this.useDoc]
    }

    async findById<T>(id: string): Promise<T> {
        const item = this.currentDoc.find(e => e.id === id)
        if (!item) throw itemNotFound
        return item
    }

    async findByName<T>(name: string): Promise<T> {
        const item = this.currentDoc.find(e => e.name === name)
        if (!item) throw itemNotFound
        return item
    }

    async add(item: any): Promise<void> {
        const cloneDb = Object.assign([], this.currentDoc)
        cloneDb.push(item)
        await this.sync(cloneDb, `add item: ${item?.name || JSON.stringify(item)}`)
        this.setCurrentDoc(cloneDb)
    }

    async update(item: any, key?: string) {
        const itemKey = key || 'id'
        const itemIndex = this.currentDoc.findIndex(e => e[itemKey] === item[itemKey])
        if (itemIndex === -1) throw itemNotFound

        const cloneDb: any[] = Object.assign([], this.currentDoc)
        const cloneItem = cloneDb[itemIndex]

        await this.sync(cloneDb, `update item: ${item[itemKey]}`)
        this.setCurrentDoc(cloneDb)
        return cloneItem
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
        const cloneDb = Object.assign([], this.currentDoc)
        const deletedItem = cloneDb.splice(index, 1)
        const msg = "remove item: " + deletedItem.map((e: any) => e.name || e.id).join(" ")
        await this.sync(cloneDb, msg)
        this.currentDoc.splice(index, 1)
    }

    get currentDocName(){
        return this.useDoc
    }

    get currentDoc() {
        return this.db[this.useDoc]
    }

    protected setCurrentDoc<T>(data: T[]) {
        this.db[this.useDoc] = data
    }
}