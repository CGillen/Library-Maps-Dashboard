# syntax=docker/dockerfile:1.4

FROM node:lts-alpine3.16 as builder

RUN apk --no-cache update && apk --no-cache upgrade && \
  apk add --no-cache alpine-sdk bash bash-completion git gcompat

RUN mkdir -p /data/.npm
WORKDIR /data
RUN chown -R node:node /data

RUN npm install -g @angular/cli@16

USER node

COPY package.json package-lock.json ./
RUN npm ci
COPY --chown=node:node . /data
ENTRYPOINT ["./build/entrypoint.sh"]
VOLUME [ "/data" ]

CMD ["ng", "serve", "--host", "0.0.0.0"]
