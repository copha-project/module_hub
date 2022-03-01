const axios = require('axios')
const fs = require('fs')
const path = require('path')
const AdminToken = process.env['MODULE_HUB_APP_SECRET']
const SSHDir = process.env['HOME'] + '/.ssh'
const KnownHostsFile = SSHDir + '/known_hosts'
const APP_PATH = '/var/www/copha-module-hub'
const HOST_USER = 'ubuntu'
const PackageHostsUrl = 'https://hub.copha.net/api/v1/package_hosts'

const quit = (msg)=>{
    console.log(msg)
    process.exit()
}

async function main(){
    const { execa, execaCommandSync } = await import('execa')
    const task = (cmd, options={}) => {
        const {stderr, stdout} = execaCommandSync(cmd,{shell: true, ...options})
        console.log(stdout || stderr)
    }
    const sshExecBuilder = host =>{
        return cmd => {
            task(`ssh ${host.user || HOST_USER}@${host.host} '${cmd}'`)
        }
    }

    const hosts = await axios.get(PackageHostsUrl)
    if(hosts.data.code !== 200 || hosts.data.data.length === 0) throw new Error('no hosts found')
    console.log(execaCommandSync('ssh-add -D').stdout)
    for (const host of hosts.data.data) {
        const hostSecretResp = await axios.get(`${PackageHostsUrl}/${host.id}/secret`,{
            headers: {
                authorization: AdminToken,
            },
        })
        if(hostSecretResp.data?.code !== 200) throw new Error(`fetch host secret info error: ${hostSecretResp.data.msg || hostSecretResp.data.code}`)
        // fs.writeFileSync(`${host.host}.key`,hostSecret.data.data+'\n')
        // fs.chmodSync(`${host.host}.key`, 0o400)
        // execa.execaCommandSync(`ssh-add ./${host.host}.key`)
        const hostSecret = hostSecretResp.data.data.secret
        console.log(`---- Adding ${host.host} openssh private key`)
        task('ssh-add - ', {input: hostSecret.key+'\n'})
        console.log(`---- Adding host ${host.host} to known_hosts`)
        
        const {stdout} = await execa('ssh-keyscan', ['-p', '22', host.host])
        
        fs.appendFileSync(KnownHostsFile, stdout)
        // await fs.chmodAsync(knownHostsFile, '644')
        hostSecret.host = host.host
        hostSecret.path = hostSecret.path || APP_PATH
        const sshExec = sshExecBuilder(hostSecret)
        const targetPath = `${hostSecret.user || HOST_USER}@${ hostSecret.host }:${ hostSecret.path }`
        task(`rsync -rvz ./dist ${targetPath}`)
        task(`scp ./package.json ./yarn.lock ./ecosystem.config.js  ${targetPath}`)
        sshExec(`cd ${ hostSecret.path } && yarn`)
        sshExec(`cd ${ hostSecret.path } && pm2 start ecosystem.config.js`)
        console.log(`${host.host} update ok`)
    }
    quit("---- All host deploy done")
}

;(async()=>{
    process.chdir(path.join(__dirname,'../'))
    try {
        execa.execaCommandSync('ssh-add -a /tmp/ssh-auth.sock')
        await main()
    } catch (error) {
        quit(error)
    }
})()