import Base from './base'

export default class Controller extends Base {
    getMethod(method: Exclude<keyof this, "getMethod">){
        return (this[method] as any).bind(this)
    }
}