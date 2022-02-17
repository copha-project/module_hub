import Utils from 'uni-utils'
import Base from './base'
import { randomUUID } from 'crypto'

export default class Auth extends Base {
    newUUID(){
        return randomUUID()
    }
    UUID2Hex(uuid: string){
        return Buffer.from(uuid).toString('hex')
    }
    Hex2UUID(){
        return Buffer.from(randomUUID(),'hex').toString()
    }
    newToken(identifierCode: string){
        return Utils.hash.sha1(this.config.keyConfig.AppKey + Utils.atoh(identifierCode) + this.config.keyConfig.AppSecret)
    }
    verifyToken(identifierCode: string, token: string){
        return this.newToken(identifierCode) === token
    }
}

export const getAuthController = () => Auth.getInstance<Auth>()