import Utils from 'uni-utils'
import Repository from "../../../class/repository"
import { Module } from "../model"
import { Octokit } from "@octokit/core"

export default class RemoteRepository extends Repository implements Repository {
    private db: Module[] = []
    private sha: string = ""

    async init(){
        try {
            await super.loadStorageList()
            const modulesData = await Utils.download(this.dbConfig.RemoteSource,{})
            const jsonData = JSON.parse(modulesData)
            this.sha = jsonData.sha
            this.db = JSON.parse(Buffer.from(jsonData.content,'base64').toString('utf-8'))
        } catch (error:any) {
            this.log.err(`get db error: ${error.message}`)
        }
    }

    findByName(name: string): Promise<Module | undefined> {
        return Promise.resolve(this.db.find(e=>e.name === name))
    }

    add(module: Module): Promise<void | Module> {
        throw new Error("Method not implemented.")
    }

    async update(module: Module){
        const editModule = this.db.find(e=>e.name === module.name)!
        editModule.packages = []
        const content = Buffer.from(JSON.stringify(this.db, undefined, 4)).toString('base64')
        return this.save(content)
    }

    delete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.")
    }

    async all(): Promise<Module[]> {
        return this.db
    }

    private async save(content:string){
        const octokit = new Octokit({auth: this.appConfig.GithubToken})
        const resp = await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
            owner: "copha-project",
            repo: "module-database",
            path: "modules.json",
            branch: "main",
            message: "update module data",
            content: content,
            sha: this.sha
        })
        if(resp.status === 200){
            this.sha = resp.data.content?.sha!
        }
    }

    get hash(){
        return this.sha
    } 
}