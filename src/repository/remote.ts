import Repository from "../class/repository"
import { Octokit } from "@octokit/core"

const RepoMeta = {
    owner: "copha-project",
    repo: "module-database",
    path: ''
}
export default class RemoteRepository extends Repository{
    private docNames = ['modules','packageHosts']
    private shas:{[key:string]:string} = {}
    private lastCommit: {sha:string} = {sha:""}
    private githubAPI = new Octokit({auth: this.config.appConfig.key.GithubToken})

    async init(){
        try {
            await this.getLastCommit()
            await this.sync()
        } catch (error:any) {
            this.log.err(`get db error: ${error.message}`)
        }
    }

    protected async sync(doc?: any[], msg?: string){
        if(doc){
            const commitMessage = msg || `update ${this.currentDocName} data`
            const resp = await this.githubAPI.request("PUT /repos/{owner}/{repo}/contents/{path}", {
                ...this.getRepoMeta(this.currentDocName),
                message: commitMessage,
                content: this.content2b(doc),
                sha: this.shas[this.currentDocName]
            })
            if(resp.status === 200){
                this.log.info("sync: " + commitMessage)
                this.shas[this.currentDocName] = resp.data.content?.sha!
            }
        }else{
            for (const doc of this.docNames) {
                const resp = await this.githubAPI.request("GET /repos/{owner}/{repo}/contents/{path}", {
                    ...this.getRepoMeta(doc)
                })
                if(resp.status === 200){
                    const docData = resp.data as {content:string, sha: string}
                    this.use(doc).setCurrentDoc(this.content2o(docData.content))
                    this.shas[doc] = docData.sha
                }   
            }
        }
    }

    async getLastCommit(){
        const res = await this.githubAPI.request('GET /repos/{owner}/{repo}/commits', {
            ...this.getRepoMeta(this.docNames[0]),
            per_page: 1
        })
        if(res.status === 200){
            this.lastCommit = res.data[0]
        }
        return this.lastCommit
    }

    private getRepoMeta(file:string){
        RepoMeta.path = `${file}.json`
        return RepoMeta
    }

    protected content2b(data:unknown){
        return Buffer.from(JSON.stringify(data, undefined, 4)).toString('base64')
    }

    protected content2o(data:string){
        return JSON.parse(Buffer.from(data,'base64').toString('utf-8'))
    }

    get lastCommitHash(){
        return this.lastCommit.sha.slice(0,7)
    }
}

export const getRemoteRepository = () => RemoteRepository.getInstance<RemoteRepository>()