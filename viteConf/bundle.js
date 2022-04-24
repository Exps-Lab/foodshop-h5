import { resolve, basename } from 'path' 
import glob from 'glob'
import fs from 'fs'

const templateURl = resolve(__dirname, '../public/index.html')
const pageURl = resolve(__dirname, '../src/pages/**/main.js')

function generateInput() {
  let pageEntry = {};
  const allEntry = glob.sync(pageURl);
  
  allEntry.forEach((entry) => {
    const templateFile = fs.readFileSync(templateURl).toString();
    const index = templateFile.indexOf('</body>');
    let content = '';
    if (index !== -1) {
      content = templateFile.slice(0, index) +
        `<script type="module" src="${entry}"></script>` +
        templateFile.slice(index);
    }
    const pad = entry.split('/');
    const name = pad[pad.length - 2];
    const page = pad.slice(0, pad.length - 1).join('/') ;
    fs.writeFileSync(page + '/index.html', content, { flag: 'as+' });
    
    // 命名input配置列表
    const key = basename(name, '.html');
    const value = page + '/index.html';
    pageEntry[key] = value;
  });
  return pageEntry
}

export default {
  outDir: resolve(__dirname, '../dist'),
  rollupOptions: {
    input: generateInput()
  }
}