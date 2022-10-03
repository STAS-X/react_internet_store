FROM node:14 as server
WORKDIR /app
COPY server/package.json /app
RUN npm install
COPY server /app

EXPOSE 3000
CMD ["npm", "start"]