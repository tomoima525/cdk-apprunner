FROM node:16-slim

WORKDIR /usr/src/app

COPY . .

RUN yarn install --pure-lockfile --non-interactive

EXPOSE 8000

CMD ["yarn", "start"]