FROM node:16-alpine

WORKDIR '/app'
# tells docker what specified dependencies to install into a node_module folder, but only on the temporary container
COPY ./package.json ./
RUN npm install
COPY . .
# default commands that we always use for node js applications, package.json "start": "NODE_ENV=production node index.js"
CMD ["npm", "run", "start"]