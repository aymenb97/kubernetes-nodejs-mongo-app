FROM alpine:3.10

RUN apk add --update nodejs npm

RUN addgroup -S node && adduser -S node -G node

USER node

RUN mkdir /home/node/code

WORKDIR /home/node/code

COPY --chown=node:node package-lock.json package.json ./

COPY --chown=node:node . .

RUN npm install

ENV MONGO_ENDPOINT "mongodb://mongo:27017"

ENV PORT 3000

EXPOSE 3000



CMD ["node","app.js"]