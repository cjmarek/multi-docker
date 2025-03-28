FROM node:14.14.0-alpine
WORKDIR '/app'
# tells docker what specified dependencies to install into a node_module folder, but only on the temporary container
COPY ./package.json ./
RUN npm install
COPY . .
# default commands that we always use for applications created from React App
CMD ["npm", "run", "start"]