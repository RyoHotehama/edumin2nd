FROM node:17.6.0

WORKDIR /app/edumin/client

COPY package*.json /app/edumin/client

EXPOSE 3000