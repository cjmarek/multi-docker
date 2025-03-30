FROM node:16-alpine as builder
WORKDIR '/app'
# tells docker what specified dependencies to install into a node_module folder, but only on the temporary container
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
