FROM node:10-slim AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . .
ENV PORT 8080
EXPOSE $PORT
CMD yarn serve
