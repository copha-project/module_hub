import { getServer } from './class/server'
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({path:path.join(__dirname,'../.env')})
getServer().launch()