FROM node:16.16.0 AS build
#node:21.7.1-alpine3.19
WORKDIR /app
COPY package*.json /app/
RUN npm install --legacy-peer-deps
#RUN npm config set registry https://nexus.qjdchina.com/nexus/repository/npm/  && npm install --legacy-peer-deps
ADD . /app
RUN npm run build:beta

FROM nginx:1.17.7-alpine
COPY --from=build /app/dist /usr/share/nginx/html
RUN mkdir /opt/logs
# 处理二级目标时默认文件找到不到的问题
RUN sed -i 's/index index.html index.htm/try_files $uri $uri\/ \/index.html/g' /etc/nginx/conf.d/default.conf
RUN mkdir /logs /upload
