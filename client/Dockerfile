# FROM node:16-alpine as builder
# WORKDIR '/app'
# # tells docker what specified dependencies to install into a node_module folder, but only on the temporary container
# COPY ./package.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# FROM nginx
# EXPOSE 3000
# COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
# COPY --from=builder /app/build /usr/share/nginx/html


# Original code up above, below is similar code for Frontend project

# we are creating here a dockerfile for the production environment
# this docker file is creating a production server, which means the code is not undergoing code changes like a dev environment would
# so we are not going to worry about volumes
# we are creating two parts where the second part is created from the first part, using the alias of 'builder' we came up with (builder could be foo)
# container 1 . . . The build phase
FROM node:16-alpine as builder
WORKDIR '/app'

# copy package.json to the temporary container (used as part of the image building process). 
# npm install will find package.json in the temp container, and will create a node_modules folder there

COPY ./package.json ./
# There will also be a node_modules folder in our local folder. We don't need it. So we will delete the local node_modules folder because it is huge.
RUN npm install
# copy local files and folders over to temp container
COPY . .
# When you run a build command, a build folder gets created over in the working directory (the temp container folder (/app) )
# throw the build assets over into the working directory build folder for production deployment
# After this point, we don't need any of the package.json, node modules etc that is in the temp container /app folder. Only needed it for doing a build
RUN npm run build

# See ProductionEnvironmentNginx.png for why nginx
# container 2 . . . The Run phase, copy ONLY the build directory over to nginx to serve the application from a nginx server.
# NOTE: All the other files (other than the build folder) are not needed in the final production folder, we only copy over the build folder.
# so container 2 is very much smaller.
FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
# The container side folder structure came from the Docker hub repository documentation
COPY --from=builder /app/build /usr/share/nginx/html

# my ports 8080, 8081, 8082, 8083 are already being used, 8085 is one that is still available
# https://stackoverflow.com/questions/65874912/docker-error-response-from-daemon-ports-are-not-available-listen-tcp-0-0-0-0
#                     see AvailablePorts.png
# docker run -p 3000:80  [image id]
# nginx uses port 80 by default, so now, we can actually run this production version with docker run -p 3000:80  [image id] using Nginx web server http://localhost:3000
#CMD ["npm", "run", "start"]   <----NOPE, we don't need this because Nginx automatically performs a default cmd start up of the web server container natively.
