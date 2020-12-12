FROM node:lts-alpine

ENV NPM_TOKEN=""
RUN \
	echo '@bernardmcmanus:registry=https://npm.pkg.github.com/' >> /root/.npmrc; \
	echo '//npm.pkg.github.com/:_authToken=${NPM_TOKEN}' >> /root/.npmrc

RUN mkdir -p /src && chown node:node /src
WORKDIR /src
USER node

COPY package.json package-lock.json ./

RUN npm ci --ignore-scripts

COPY --chown=node:node . .

# lerna dependencies are bootstrapped by the postinstall script.
RUN npm run postinstall
