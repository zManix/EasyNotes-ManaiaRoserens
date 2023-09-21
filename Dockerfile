
FROM node:16-slim 
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build && rm -r src && rm .env
WORKDIR /app/dist
EXPOSE 3000
CMD [ "node", "app.js" ]