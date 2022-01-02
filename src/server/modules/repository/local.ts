import path from "path"
import { readJsonSync } from 'uni-utils'
import { Module } from "../model"
import Repository from "../../../class/repository"

export default class LocalRepository extends Repository{
    init(filePath?: string) {
        this.db = readJsonSync(filePath || this.dbFilePath)
    }

    private get dbFilePath() {
        return path.join(this.publicPath, 'modules.json')
    }
}