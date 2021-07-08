FROM node:lts-alpine

ENV NPM_TOKEN=""
RUN echo '//registry.npmjs.org/:_authToken=${NPM_TOKEN}' >> /home/node/.npmrc

RUN mkdir -p /src && chown node:node /src
WORKDIR /src
USER node

COPY package.json package-lock.json ./

RUN npm ci --ignore-scripts

COPY --chown=node:node . .

# lerna dependencies are bootstrapped by the postinstall script.
RUN npm run postinstall
