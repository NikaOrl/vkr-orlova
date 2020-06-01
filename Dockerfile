### STAGE 1: Build ###
FROM node:8.11.2-alpine AS build

# setting default work directory
WORKDIR /vkr-orlova

# copying package.json file from local root directory
# — this file contains all dependencies that our app requires
COPY package.json ./

# installing necessary libraries (based on a file copied in previous step)
RUN cd ./ && npm i

# copying all remaining files with a source code
COPY . .

# compiling our app
RUN npm run build
# RUN npm run create-tables
# RUN npm run insert-tables

# Устанавливаем переменную среды для loglevel
ENV NPM_CONFIG_LOGLEVEL warn

### STAGE 2: Run ###
EXPOSE 4200
EXPOSE 3000
CMD ["sh", "-c", "npm start"]
