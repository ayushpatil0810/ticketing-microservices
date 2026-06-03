FROM node:alpine

WORKDIR /app
COPY package.json ./
COPY src ./src
RUN npm install
COPY . .

CMD ["npm", "start"]