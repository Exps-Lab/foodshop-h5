// 删除打包生成的sourceMap文件和对应js的sourceMap标记

const { readdirSync, readFileSync, writeFileSync, unlinkSync, existsSync } = require('fs')
const path = require('path')

// 服务根目录
const rootPath = process.cwd()
const distFile = path.join(rootPath, '/hi-user/assets')

const removeSourceMapFiles = async () => {
  if (await existsSync(distFile)) {
    const files = await readdirSync(distFile)
    files.map(async file => {
      const filePath = path.join(distFile, file)
      // [note] 删除sourceMap
      if (filePath.includes('.js.map')) {
        await unlinkSync(filePath)
        console.log(`${file}__文件已删除`)
      } else if (filePath.includes('.js')) {
        // [note] 删除对应js的sourceMap标识
        const fileContentStr = await readFileSync(filePath).toString()
        const sourceMapFlagIndex = fileContentStr.indexOf('//# sourceMappingURL')
        const handledFileContent = fileContentStr.slice(0, sourceMapFlagIndex)
        await writeFileSync(filePath, handledFileContent, { flag: 'w+' })
      }
    })
  }
}

removeSourceMapFiles()




