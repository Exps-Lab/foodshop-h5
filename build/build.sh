# 上传前处理

# 打包
npm run build:prod
# 压缩dist文件
tar -cvf 'hi-user.tar' './hi-user'
# 上传服务器
node './deploy/index.js'
# 删除tar包
rm './hi-user.tar'
