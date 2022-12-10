
const path = require('path')
const { Client } = require('ssh2')
const chalk = require('chalk')

const conn = new Client();
const fileName = 'hi-user.tar'
const distFile =  path.resolve(__dirname, `../${fileName}`)
const serverWebsiteDir =  path.resolve(__dirname, '/home/website')
const serverWebsiteFile =  path.resolve(__dirname, `/home/website/${fileName}`)
// 远程服务器配置
const serverConf = {
  host: '43.138.5.12',
  port: 22,
  username: 'root',
  password: 'Haihan12345'
}

try {
  conn.on('ready', async () => {
    console.log(chalk.green(`准备开始连接远程服务器：${serverConf.host}`))
    console.log(chalk.green(`具体远程部署位置：${serverWebsiteDir}`))

    await sftp()
    await tarShell()

    console.log(chalk.green(`部署完成!`))
  }).connect(serverConf);
} catch (e) {
  conn.end()
  console.log(chalk.red(e.message))
}

// 用sftp上传文件
function sftp () {
  return new Promise((resolve, reject) => {
    conn.sftp((err, sftp) => {
      if (err) throw err;
      sftp.fastPut(distFile, serverWebsiteFile, (err) => {
        if (err) {
          console.log(chalk.red(err))
          reject(err)
        } else {
          console.log(chalk.green(`文件已上传：${serverWebsiteDir}`))
          resolve()
        }
      });
    });
  })
}

// 解压部署操作
function tarShell () {
  return new Promise((resolve, reject) => {
    conn.shell((err, stream) => {
      if (err) {
        reject(err)
      } else {
        stream.end(
          `
          j /home/website/
          tar xvf hi-user.tar
          chmod 777 hi-user
          rm -rf hi-user.tar
          exit
          `
        ).on('data', data => {
          console.log(chalk.green(data.toString()))
          resolve()
        }).on('close', () => {
          conn.end()
        })
      }
    })
  })
}
