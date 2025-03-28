FROM nginx
# need to customize the image from Docker hub with our own specfic routing rules
# So copy the configuration file into the temporary file, (over writes an existing default version of default.conf) essentially into the image.
# The container file structure we are using here was specified in the documentation for nginx
# on Docker hub. nginx documentation says to expect to find the configuration file in this location
COPY ./default.conf /etc/nginx/conf.d/default.conf