import Repository from "../../../class/repository"
import { Module,UpdateModule } from "../model"
import { Octokit } from "@octokit/core"
export default class RemoteRepository extends Repository{
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

    protected async sync(content?:string, commitMessage:string="update module data"){
        if(content){
            const resp = await this.githubAPI.request("PUT /repos/{owner}/{repo}/contents/{path}", {
                ...this.moduleMeta,
                branch: "main",
                message: commitMessage,
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
                this.db = this.content2o(modulesData.content)
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