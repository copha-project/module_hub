import { spawn } from 'child_process'
import winston, { format, createLogger }  from 'winston'

const LogBaseConfig = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        data: 3,
        debug: 4,
        verbose: 5,
        silly: 6,
        custom: 7
    },
    colors: {
        error: 'red',
        debug: 'blue',
        warn: 'yellow',
        data: 'grey',
        info: 'green',
        verbose: 'cyan',
        silly: 'magenta',
        custom: 'yellow'
    }
}
const LogTextFormatConfig = format.printf(({ level, message, timestamp }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
const LogTimeConfig = format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'})
const LogColorConfig = format.colorize({ all: true })

export default class Logger {
    logger: any
    constructor(logConf?:{infoPath:string, errPath:string}){
        winston.addColors(LogBaseConfig.colors)
        this.logger = createLogger({
            level: 'info',
            levels: LogBaseConfig.levels,
            format: winston.format.json(),
            transports: []
        })
        if(logConf?.infoPath){
            this.logger.add(new winston.transports.File({
                filename: logConf.infoPath,
                level: 'info',
                format: format.combine(
                    LogTimeConfig,
                    LogTextFormatConfig
                )
            }))
        }
        if(logConf?.errPath){
            this.logger.add(new winston.transports.File({
                filename: logConf.errPath,
                level: 'error',
                format: format.combine(
                    LogTimeConfig,
                    LogTextFormatConfig
                )
            }))
        }
        this.logger.add(new winston.transports.Console({
            format: format.combine(
                LogTimeConfig,
                LogTextFormatConfig,
                LogColorConfig,
            )
        }))
        this.info('logger init')
    }
    static async stream(logPath:string){
        const tailProc = spawn('tail', ['-f',logPath])
        tailProc.stdout.on('data', (data:string) => {
            console.log(`${data}`)
        })

        tailProc.stderr.on('data', (data:string) => {
            throw Error(`${data}`)
        })
    }
    async stream(logPath: string){
        return Logger.stream(logPath)
    }

    debug(...e:string[]){
        this.logger.debug(e)
    }
    err(...e:string[]){
        this.logger.error(e)
    }
    info(...e:string[]){
        this.logger.info(e)
    }
    warn(...e:string[]){
        this.logger.warn(e)
    }
}