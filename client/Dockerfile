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


# Original code up above, below is similar code for client project

# we are creating here a dockerfile for the production environment
# this docker file is creating a production server, which means the code is not undergoing code changes like a dev environment would
# so we are not going to worry about volumes
# we are creating two parts where the second part is created from the first part, using the alias of 'builder' we came up with (builder could be foo)
# container 1 . . . The build phase
FROM node:16-alpine AS builder
WORKDIR '/app'

# copy package.json to the temporary container (used as part of the image building process). 
# npm install will find package.json in the temp container, and will create a node_modules folder there

COPY ./package.json ./
# There will also be a node_modules folder in our local folder. We don't need it. So we will delete the local node_modules folder because it is huge.
RUN npm install
# copy local files and folders over to temp container
COPY . .
# When you run a build command, a build folder gets created over in the working directory (the temp container folder (/app) )
# throw the build assets over into the working directory 'build folder' for production deployment
# After this point, we don't need any of the package.json, node modules etc that is in the temp container /app folder. Only needed it for doing a build
RUN npm run build

# See ProductionEnvironmentNginx.png for why nginx
# container 2 . . . The Run phase, copy ONLY the build directory over to nginx to serve the application from a nginx server.
# NOTE: All the other files (other than the build folder) are not needed in the final production folder, we only copy over the build folder.
# so container 2 is very much smaller.
FROM nginx
# This expose instruction is for the benefit of Elasticbeanstalk when deploying to AWS. This tells Elasticbeanstalk to use 3000 for port mapping for incoming traffic to nginx
EXPOSE 3000
# copy routing rules
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
# copy 'build application guts' to nginx
# This container side folder structure to use came from the Docker hub repository documentation
COPY --from=builder /app/build /usr/share/nginx/html

# my ports 8080, 8081, 8082, 8083 are already being used, 8085 is one that is still available, so none of those can be used on the right side of the xxxx:8085
# https://stackoverflow.com/questions/65874912/docker-error-response-from-daemon-ports-are-not-available-listen-tcp-0-0-0-0
#                     see AvailablePorts.png

#   What follows (lines 70 thru 72) is how to launch the production  Nginx web server. You can use any port for the left of :, 
#   and NOTE! You will * * * * NOT! NOT! NOT!!!! * * * * get the usual terminal output saying the following:
#
#Compiled successfully!
#
#You can now view whatever in the browser.
#
#  Local:            http://localhost:3000
#  On Your Network:  http://172.17.0.2:3000
#
#
#   Only the React development server will tell you that stuff!!!!
#   But this time, Nginx is the web server and not the React development server as the web server. And everything is running inside a container that is listening on Nginx port 3000.
#   so just assume 'docker run -p whatever:3000  [image id (from the build you just did)]'  http://localhost:whatever is what you will use at the browser.

# cd client
# docker build -t mytest .
# docker run -p 8085:3000  [image id (from the build you just did)]
# nginx uses port 80 by default, but at line 44 we said 3000, so now, we can actually run this production version with docker run -p 8085:3000  [image id] using Nginx web server http://localhost:8085 as a test
#CMD ["npm", "run", "start"]   <----NOPE, In this production dockerfile, we don't need this because Nginx automatically performs a default cmd start up of the web server container natively.
# Note: It won't work correctly, 
# NOTE: You will get errors as a result of the postgres and Redis servers not being available (since those are in their own containers as they are not running yet)
# you will only be able to catch a glimpse of it by refreshing the page!

# You absolutely must read my port mapping comments inside Dockerfile and inside Dockerfile.dev. The main confusion is that you can have Reacts development server start up, and it 
# will tell you to use http://localhost:3000 which is actually inside the container. So then you must use port mapping. And if by choice, you set up mapping ports 3000:3000, then you 
# do end up using http://localhost:3000 at the browser. But NOT because of the React development servers admonition that you should. So confusing if you don't think it through. And
# you need to think it through to understand what you are doing.