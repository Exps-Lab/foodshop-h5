import { resolve, basename } from 'path'
import glob from 'glob'
import fs from 'fs'

// 公共的index模板
const templateURl = resolve(__dirname, '../public/index.html')
const pageURl = resolve(__dirname, '../src/pages/**/main.js')

// 获取所有的多页文件路径
function generateInput() {
  let pageEntry = {};
  const allEntry = glob.sync(pageURl);

  allEntry.forEach((entry) => {
    const templateFile = fs.readFileSync(templateURl).toString();
    const index = templateFile.indexOf('</body>');
    let content = '';
    if (index !== -1) {
      content = templateFile.slice(0, index) +
        `<script type="module" src="./main.js"></script>` +
        templateFile.slice(index);
    }
    const pad = entry.split('/');
    const name = pad[pad.length - 2];
    const indexPage = pad.slice(0, pad.length - 1).join('/')  + '/index.html';
    if (fs.existsSync(indexPage)) {
      fs.rmSync(indexPage)
    }
    fs.writeFileSync(indexPage, content, { flag: 'as+' });

    // 命名input配置列表
    pageEntry[name] = indexPage;
  });

  // 处理入口index的所有文件资源展示
  getFileList(pageEntry)
  return pageEntry
}

/**
 * 在根目录处生成index.html，展示所有src/page内的文件列表
 * @param mutiFileObj "src/page"内的所有文件的绝对路径
 * 例如：{
     home: '/Users/zoro/workspace/TestTry/express-vue3-shopping/hi-user/src/pages/home/index.html',
     other: '/Users/zoro/workspace/TestTry/express-vue3-shopping/hi-user/src/pages/other/index.html'
   }
 * @returns {boolean}
 */
function getFileList (mutiFileObj = {}) {
  const fileNameArr = Object.keys(mutiFileObj)
  if (!fileNameArr.length) return false

  // 还是使用公共的index模板
  let templateFile = fs.readFileSync(templateURl).toString();
  // 输出的路径(root)和文件名(index)
  let rootPath = resolve(__dirname, '../')
  const rootPathIndex = rootPath + '/index.html'

  let listHtmlText = '<ul style="font-size: 16px;"> # 所有资源列表，点击跳转到对应页面 #'
  for (let fileName of fileNameArr) {
    const fileDirPos = mutiFileObj[fileName].indexOf('/src')
    const fileDir = mutiFileObj[fileName].slice(fileDirPos)
    let boxHtml =
      '<li style="margin: 15px 0;">' +
        `<span>${fileName}：</span>` +
        `<a href="${fileDir}">${fileDir}</a>` +
      '</li>'
    listHtmlText += boxHtml
  }
  listHtmlText += '</ul>'

  // 在index的<div id="app">插入变量，如有好点的参照可替换~
  const index = templateFile.indexOf('</div>');
  let content = '';
  if (index !== -1) {
    content = (templateFile.slice(0, index) + listHtmlText + templateFile.slice(index))
  }

  if (fs.existsSync(rootPathIndex)) {
    fs.rmSync(rootPathIndex)
  }
  fs.writeFileSync(rootPathIndex, content, { flag: 'as+' });
}

export default {
  outDir: resolve(__dirname, '../dist'),
  rollupOptions: {
    input: {
      ...generateInput(),
      navigation: resolve(__dirname, '../index.html')
    }
  }
}
