FROM node:12.2.0-alpine

RUN apk add --update \
    git \
    yarn

COPY . /sdk
WORKDIR /sdk

RUN yarn install && yarn build