# use node base image
FROM node:latest

# define environment variables
ENV OPENAI_API_KEY="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"
ENV GOOGLE_API_KEY="./apiKey.json"

# set the working directory in the container
WORKDIR /app

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