# use node base image
FROM node:latest

# set the working directory in the container
WORKDIR /app

# copy package.json and package-lock.json
COPY package*.json ./

# install dependencies
RUN npm install

# copy app's source code
COPY . .

# build svelte app
RUN npm run build