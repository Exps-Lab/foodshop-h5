# 上传前处理

app_name=hi-user
file_name="$app_name.tar"

# 打包
npm run build:prod

# 压缩dist文件
tar -cvf $file_name ./$app_name

# ssh2上传到服务器
node './deploy/index.js'

# 删除本地tar包
rm ./$file_name
