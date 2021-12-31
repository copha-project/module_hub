import Repository from "../../../class/repository"
import { Module,UpdateModule } from "../model"
import { NotFoundError } from '../../../class/error'
import { Octokit } from "@octokit/core"
export default class RemoteRepository extends Repository implements Repository {
    private db: Module[] = []
    private sha: string = ""
    private lastCommit: {sha:string} = {sha:""}
    private githubAPI = new Octokit({auth: this.appConfig.GithubToken})

    private moduleMeta = {
        owner: "copha-project",
        repo: "module-database",
        path: "modules.json",
    }

    async init(){
        try {
            await super.loadStorageList()
            await this.getLastCommit()
            await this.sync()
        } catch (error:any) {
            this.log.err(`get db error: ${error.message}`)
        }
    }

    async findByName(name: string): Promise<Module> {
        const module = this.db.find(e=>e.name === name)
        if(!module) throw new NotFoundError("module not found")
        return module
    }

    async add(module: Module): Promise<Module> {
        const cloneDb: Module[] = Object.assign([],this.db)
        cloneDb.push(module)
        const content = Buffer.from(JSON.stringify(cloneDb, undefined, 4)).toString('base64')
        await this.sync(content)
        this.db = cloneDb
        return module
    }

    async update(name: string, module: UpdateModule){
        const cloneDb: Module[] = Object.assign([],this.db)
        const editModule = cloneDb.find(e=>e.name === name)!
    
        if(module.desc) editModule.desc = module.desc
        if(module.repository) editModule.repository = module.repository

        editModule.packages = module.packages

        const content = Buffer.from(JSON.stringify(cloneDb, undefined, 4)).toString('base64')
        await this.sync(content)
        this.db = cloneDb
    }

    delete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.")
    }

    async all(): Promise<Module[]> {
        return this.db
    }

    private async sync(content?:string){
        if(content){
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
        }else{
            const resp = await this.githubAPI.request("GET /repos/{owner}/{repo}/contents/{path}", {
                ...this.moduleMeta
            })
            if(resp.status === 200){
                const modulesData = resp.data as {content:string, sha: string}
                this.sha = modulesData.sha
                this.db = JSON.parse(Buffer.from(modulesData.content,'base64').toString('utf-8'))
            }
        }
    }

    async getLastCommit(){
        const res = await this.githubAPI.request('GET /repos/{owner}/{repo}/commits', {
            ...this.moduleMeta,
            per_page: 1
        })
        if(res.status === 200){
            this.lastCommit = res.data[0]
        }
        return this.lastCommit
    }
    
    get lastCommitHash(){
        return this.lastCommit.sha.slice(0,7)
    }
}