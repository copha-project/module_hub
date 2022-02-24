import crypto from 'crypto'
import Base from './base'

export default class Crypto extends Base {

    static BLOCK_CIPHER: crypto.CipherGCMTypes = 'aes-256-gcm'
    static KEY_BYTE_LEN = 32
    static AUTH_TAG_BYTE_LEN = 16
    static IV_BYTE_LEN = 12
    static SALT_BYTE_LEN = 16

    getIV(){
        return crypto.randomBytes(Crypto.IV_BYTE_LEN)
    }

    getSalt(){
        return crypto.randomBytes(Crypto.SALT_BYTE_LEN)
    }

    getKeyFromPassword(password: string, salt: string | Buffer){
        return crypto.scryptSync(password, salt, Crypto.KEY_BYTE_LEN);
    }

    encrypt(data: Buffer, pass: string){
        const iv = this.getIV()
        const salt = this.getSalt()
        const key = this.getKeyFromPassword(pass, salt)

        const cipher = crypto.createCipheriv(Crypto.BLOCK_CIPHER, key, iv, {
            authTagLength: Crypto.AUTH_TAG_BYTE_LEN
        })
        let encryptedMessage = cipher.update(data);
        encryptedMessage = Buffer.concat([encryptedMessage, cipher.final()])
        return Buffer.concat([iv, encryptedMessage, cipher.getAuthTag(), salt]).toString('hex')
    }

    decrypt(data: string, pass: string){
        const ciphertext = Buffer.from(data,'hex')
        const authTag = ciphertext.slice(-32, -16)
        const iv = ciphertext.slice(0, 12)
        const salt = ciphertext.slice(-16)
        const key = this.getKeyFromPassword(pass, salt)

        const encryptedMessage = ciphertext.slice(12, -32)
        const decipher = crypto.createDecipheriv(
            Crypto.BLOCK_CIPHER, key, iv,
            { 'authTagLength': Crypto.AUTH_TAG_BYTE_LEN })
        decipher.setAuthTag(authTag)
        const messagetext = decipher.update(encryptedMessage)
        return Buffer.concat([messagetext, decipher.final()])
    }
}

export const getCrypto = () => Crypto.getInstance<Crypto>()