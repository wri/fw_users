FROM node:20
MAINTAINER server@3sidedcube.com

ENV NAME fw-users

WORKDIR /opt/$NAME

COPY package.json ./
COPY yarn.lock ./
RUN yarn install

COPY ./app ./app
COPY ./config ./config
COPY ./.babelrc ./
COPY ./.eslintrc.yml ./.eslintrc.yml
COPY ./tsconfig.json ./
RUN yarn build

EXPOSE 3001

CMD ["node", "dist/app.js"]
