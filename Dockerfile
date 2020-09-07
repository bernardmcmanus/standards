FROM node:lts-buster

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

# npm disables pre/post hooks when running as root.
# lerna dependencies are bootstrapped by the postinstall script.
RUN npm run postinstall
