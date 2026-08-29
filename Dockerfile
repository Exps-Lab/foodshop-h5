# 构建阶段
FROM node:18.20-alpine AS builder

WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm config set registry https://registry.npmmirror.com && \
    npm install --production=false

# 复制源代码
COPY . .

# 构建生产版本
RUN npm run build:prod

# 运行阶段
FROM nginx:1.24-alpine

# 复制构建产物到 Nginx
COPY --from=builder /app/hi-user /usr/share/nginx/html/hi-user

# 复制 Nginx 配置（可选）
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
