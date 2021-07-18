FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY src ./src
COPY Data ./Data
COPY tsconfig.json ./
RUN npx tsc
ENTRYPOINT [ "node", "dist/index.js" ]
CMD [ "Data/example1.txt" ]
