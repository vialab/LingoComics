# use node base image
FROM node:latest

# set the working directory in the container
WORKDIR /app

ARG OPENAI_API_KEY

# copy package.json and package-lock.json
COPY package*.json ./

# install dependencies
RUN npm install

# sync
RUN npm run prepare

# copy app's source code
COPY . .

# build svelte app
RUN npm run build

# expose port 4713
EXPOSE 4173