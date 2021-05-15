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

