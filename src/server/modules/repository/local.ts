import path from "path"
import { readJsonSync, saveFile, readFile } from 'uni-utils'
import Repository from "../../../class/repository"

export default class LocalRepository extends Repository{
    async init() {
        await this.sync()
    }

    protected async sync(content?:string, commitMessage:string="update module data"){
        this.log.info("sync: " + commitMessage)
        if(content){
            await saveFile(content,this.dbFilePath)
        }else{
            const modulesData = await readFile(this.dbFilePath)
            this.db = this.content2o(modulesData)
        }
    }

    private get dbFilePath() {
        return path.join(this.publicPath, 'modules.json')
    }

    protected content2b(data:unknown){
        return JSON.stringify(data, undefined, 4)
    }

    protected content2o(data:string){
        return JSON.parse(data)
    }
}