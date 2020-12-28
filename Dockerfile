FROM node:10.16.3

RUN mkdir -p /home/freshagric/app/node_modules && chown -R node:node /home/freshagric/app

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global

WORKDIR /home/freshagric/app

COPY package*.json ./

USER node

COPY --chown=node:node . .

RUN npm install

EXPOSE 4400

CMD [ "node", "app.js"]