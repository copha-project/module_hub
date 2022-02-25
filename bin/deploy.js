const axios = require('axios')
const fs = require('fs')
const path = require('path')
const AdminToken = process.env['MODULE_HUB_APP_SECRET']
const SSHDir = process.env['HOME'] + '/.ssh'
const APP_PATH = '/var/www/copha-module-hub'
const HOST_USER = 'ubuntu'

const quit = (msg)=>{
    console.log(msg)
    process.exit()
}

async function main(){
    const { execa, execaCommandSync } = await import('execa')
    const task = cmd => {
        const {stderr, stdout} = execaCommandSync(cmd,{shell: true})
        console.log(stdout || stderr)
    }
    const sshExecBuilder = host =>{
        return cmd => {
            task(`ssh ${host.user || HOST_USER}@${host.host} '${cmd}'`)
        }
    }

    const PackageHostsUrl = 'https://hub.copha.net/api/v1/package_hosts'
    const hosts = await axios.get(PackageHostsUrl)
    if(hosts.data.code !== 200 || hosts.data.data.length === 0) throw new Error('no hosts found')
    console.log(execaCommandSync('ssh-add -D').stdout)
    for (const host of  hosts.data.data) {
        const hostKey = await axios.get(`${PackageHostsUrl}/${host.id}/key`,{
            headers: {
                authorization: AdminToken,
            },
        })
        if(hostKey.data.code !== 200) throw new Error(`fetch key error: ${hostKey.data.msg || hostKey.data.code}`)
        // fs.writeFileSync(`${host.host}.key`,hostKey.data.data+'\n')
        // fs.chmodSync(`${host.host}.key`, 0o400)
        // execa.execaCommandSync(`ssh-add ./${host.host}.key`)
        console.log(`Adding ${host.host} openssh private key`)
        console.log(execaCommandSync('ssh-add - ', {input: hostKey.data.data+'\n'}).stderr);

        console.log(`Adding host ${host.host} to known_hosts`)
        
        const {stdout} = await execa('ssh-keyscan', ['-p', '22', host.host])
        const knownHostsFile = SSHDir + '/known_hosts'
        fs.appendFileSync(knownHostsFile, stdout)
        // await fs.chmodAsync(knownHostsFile, '644')
        const sshExec = sshExecBuilder(host)
        task(`rsync -rvz ./dist ${host.user || HOST_USER}@${host.host}:${APP_PATH}`)
        task(`scp ./package.json ./yarn.lock ./ecosystem.config.js  ${host.user || HOST_USER}@${host.host}:${APP_PATH}`)
        sshExec(`cd ${APP_PATH} && yarn`)
        sshExec(`cd ${APP_PATH} && pm2 start ecosystem.config.js`)
    }
    quit("ok")
}

;(async()=>{
    process.chdir(path.join(__dirname,'../'))
    try {
        // execa.execaCommandSync('ssh-add -a /tmp/ssh-auth.sock')
        await main()
        // const { execa, execaCommandSync } = await import('execa')
        // console.log(execaCommandSync("ssh ubuntu@150.158.31.232 'cd /var/www/copha-module-hub && yarn'", {
        //     shell: true
        // }).stdout);
    } catch (error) {
        quit(error)
    }
})()