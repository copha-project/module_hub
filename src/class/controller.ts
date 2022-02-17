import Base from './base'
import { getAuthController } from './auth'

export default class Controller extends Base {
    protected authManager = getAuthController()
    getMethod(method: Exclude<keyof this, "getMethod">){
        return (this[method] as any).bind(this)
    }
}