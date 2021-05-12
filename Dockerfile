#### STAGE 1: Build ###
#FROM node:8.11.2-alpine AS build
#
## setting default work directory
#WORKDIR /vkr-orlova
#
## copying package.json file from local root directory
## — this file contains all dependencies that our app requires
#COPY package.json ./
#
## installing necessary libraries (based on a file copied in previous step)
#RUN cd ./ && npm i
#
## copying all remaining files with a source code
#COPY . .
#
## compiling our app
#RUN npm run build
## RUN npm run create-tables
## RUN npm run insert-tables
#
## Устанавливаем переменную среды для loglevel
#ENV NPM_CONFIG_LOGLEVEL warn
#
#### STAGE 2: Run ###
#EXPOSE 4200
#EXPOSE 3000
#CMD ["sh", "-c", "npm start"]


# Multi-stage
# 1) Node image for building frontend assets
# 2) nginx stage to serve frontend assets

# Name the node stage "builder"
FROM node:10 AS builder
# Set working directory
WORKDIR /vkr-orlova
# Copy all files from current directory to working dir in image
COPY . .
# install node modules and build assets
RUN npm i && npm run build

# nginx state for serving content
FROM nginx:alpine
# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html
# Remove default nginx static assets
RUN rm -rf ./*
# Copy static assets from builder stage
COPY --from=builder /vkr-orlova/dist/vkr-orlova .
COPY nginx.conf.template /etc/nginx/conf.d/nginx.conf.template

CMD envsubst '\$APP_SERVER' < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/default.conf \
  && nginx -g "daemon off;"

# Containers run nginx with global directives and daemon off
#ENTRYPOINT ["nginx", "-g", "daemon off;"]
