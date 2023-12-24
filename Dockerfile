FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY . .

# install required packages
RUN npm install -g pnpm
RUN npm install -g pm2

RUN pnpm install
RUN pnpm build

EXPOSE 8000

CMD ["pm2", "start"]
