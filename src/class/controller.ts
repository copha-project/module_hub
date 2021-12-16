import Base from './base'

export default class Controller extends Base {
    static instance: Controller
    static getInstance(){
        if(!this.instance){
            this.instance = new this()
        }
        return this.instance
    }
}