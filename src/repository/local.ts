import path from "path"
import { saveFile, readFile } from 'uni-utils'
import Repository from "../class/repository"

export default class LocalRepository extends Repository{
    private docNames = ['modules','packageHosts']
    async init() {
        await this.sync()
    }

    protected async sync(doc?: any[], msg?: string){
        this.log.info("sync: " + (msg || "update module data"))
        if(doc){
            await saveFile(this.content2b(doc),this.docFilePath(this.currentDocName))
        }else{
            for (const doc of this.docNames) {
                const docData = await readFile(this.docFilePath(doc))
                this.use(doc).setCurrentDoc(this.content2o(docData))
            }
        }
    }

    private docFilePath(name:string) {
        return path.join(this.config.publicPath, `${name}.json`)
    }

    protected content2b(data:unknown){
        return JSON.stringify(data, undefined, 4)
    }

    protected content2o(data:string){
        return JSON.parse(data)
    }
}

export const getLocalRepository = () => LocalRepository.getInstance<LocalRepository>()