declare type Callback = ()=>Promise<any>

declare interface ServerConfig {
    host: string
    port: number
}