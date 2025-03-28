I just noticed that a empty node_modules folder gets created in each of the projects that have a package.json file. This is because
whenever instruction 'RUN npm install' inside the Dockerfile runs, it will find the package.json to decide what dependencies are being asked for and download those dependencies into the node_modules folder. 

NOTE. When 'RUN npm install' is run from the VS CODE terminal, then all the dependencies get loaded into the local project directory for node_modules.
But when 'RUN npm install' is run from the Dockerfile, ( docker build -f Dockerfile.dev .) only the temporary container will get the dependencies installed into the temp container node_modules.
