FROM node:lts-buster

ENV NPM_TOKEN=""
RUN \
	echo '@bernardmcmanus:registry=https://npm.pkg.github.com/' >> /root/.npmrc; \
	echo '//npm.pkg.github.com/:_authToken=${NPM_TOKEN}' >> /root/.npmrc

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

# npm disables pre/post hooks when running as root.
# lerna dependencies are bootstrapped by the postinstall script.
RUN npm run postinstall
