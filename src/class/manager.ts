import Base from './base'

export default class Manager extends Base {
    static instance: Manager
    static getInstance(){
        if(!this.instance){
            this.instance = new this()
        }
        return this.instance
    }
}