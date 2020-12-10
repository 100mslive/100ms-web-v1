FROM node:lts-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY public/ public/
COPY src/ src/
COPY styles/ styles/
COPY .env .env
COPY webpack.config.js .babelrc ./

RUN npm run build

# Serve dist

FROM caddy:2.1.1-alpine
ENV ENABLE_TELEMETRY="false"

WORKDIR /app
COPY configs/certs/ /app/certs/
COPY apple-app-site-association /app/dist/.well-known/apple-app-site-association
COPY assetlinks.json /app/dist/.well-known/assetlinks.json
COPY --from=0 /app/dist /app/dist
