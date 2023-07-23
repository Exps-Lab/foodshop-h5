
const { readdirSync, unlinkSync, existsSync } = require('fs')
const path = require('path')

// 服务根目录
const rootPath = process.cwd()
const distFile = path.join(rootPath, '/hi-user/assets')

const removeSourceMapFiles = async () => {
  if (await existsSync(distFile)) {
    const files = await readdirSync(distFile)
    files.map(async file => {
      const pathName = path.join(distFile, file)
      if (pathName.includes('.map')) {
        await unlinkSync(pathName)
        console.log(`${file}文件已删除`)
      }
    })
  }
}

removeSourceMapFiles()




