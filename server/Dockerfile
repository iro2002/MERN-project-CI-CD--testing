FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g nodemon

COPY . . 

ARG MONGO_URI
ENV MONGO_URI=$MONGO_URI

EXPOSE 5001

CMD ["npm", "run", "start"]