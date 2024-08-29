FROM node:18-alpine AS base
WORKDIR /app

RUN apk add --no-cache tzdata \
    && chown -R node:node ./
ENV TZ=America/Sao_Paulo

USER node

FROM node:18-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM dependencies AS build
WORKDIR /app
COPY --chown=node:node . .
RUN npm run build

FROM base AS release
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

CMD ["node", "dist/index.js"]
