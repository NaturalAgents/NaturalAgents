
FROM node:18
WORKDIR /usr/src/app


COPY package*.json ./
RUN npm install --legacy-peer-deps


COPY . .

RUN npm run build

EXPOSE 3000

# Start the application
CMD ["npm", "start"]
