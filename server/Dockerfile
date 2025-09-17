FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# Optionally, install nodemon globally
RUN npm install -g nodemon

COPY . . 

EXPOSE 5001

CMD ["npm", "run", "start"]