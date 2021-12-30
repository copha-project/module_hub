import Repository from "../../../class/repository"
import { Module } from "../model"
import { Octokit } from "@octokit/core"
export default class RemoteRepository extends Repository implements Repository {
    private db: Module[] = []
    private sha: string = ""
    private githubAPI = new Octokit({auth: this.appConfig.GithubToken})

    private moduleMeta = {
        owner: "copha-project",
        repo: "module-database",
        path: "modules.json",
    }

    async init(){
        try {
            await super.loadStorageList()
            // const modulesData = await Utils.download(this.dbConfig.RemoteSource,{})
            const resp = await this.githubAPI.request("GET /repos/{owner}/{repo}/contents/{path}", {
                ...this.moduleMeta
            })
            const modulesData = resp.data as {content:string, sha: string}
            this.sha = modulesData.sha
            this.db = JSON.parse(Buffer.from(modulesData.content,'base64').toString('utf-8'))
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
        return this.sync(content)
    }

    delete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.")
    }

    async all(): Promise<Module[]> {
        return this.db
    }

    private async sync(content:string){
        const resp = await this.githubAPI.request("PUT /repos/{owner}/{repo}/contents/{path}", {
            ...this.moduleMeta,
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