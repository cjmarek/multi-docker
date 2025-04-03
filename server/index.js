
//similar to import
const keys = require('./keys');


//    * * * * * * * * * * * * *                          We are using Redis AND Postgres in the server container         * * * * * * * * * * * * * 
//           We are writing a index to the Postgres database in here. But then we are firing off a redis event here so that the worker side can also write a index to the redis database
//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * Express App Setup
//importing in 'express' 'body-parser' 'cors' libraries. These dependencies were stated in the package.json
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
//                     these values actually are being set in the docker-compose.yml
console.log("* * * * * * * * * * * * * * * * * * * * * * console logs * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *");
console.log(`PostgreSQL redisHost: ${keys.redisHost}`);
console.log(`PostgreSQL redisPORT: ${keys.redisPORT}`);
console.log(`PostgreSQL pgUser: ${keys.pgUser}`);
console.log(`PostgreSQL pgHost: ${keys.pgHost}`);
console.log(`PostgreSQL pgPort: ${keys.pgPort}`);
console.log(`PostgreSQL pgDatabase: ${keys.pgDatabase}`);
console.log(`PostgreSQL pgPassword: ${keys.pgPassword}`);
console.log("* * * * * * * * * * * * * * * * * * * * * * console logs * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *");









//app is the object that is going to recieve and to respond to any http requests
//that are coming or going back to the React application. The React application is what makes the initial requests, but the request pass through Nginx first to get here.
const app = express();

//cross origin resource sharing, allows us to make requests from one domain that the react app is running on (client container)
//  to a different one, port in this case (the express api) server container is hosted on.
// Each container is condsidered its own Domain
app.use(cors());
//parse incoming requests from the react application, and turn the body of the post request into a json
//value that our express API can then very easily work with.
app.use(bodyParser.json());

//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * Postgress Client Setup, 
// 
// to allow comunication with the Express Server 
// Postgres is a sql type database very similar to mySql
const { Pool } = require('pg');
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
  // ssl:    lecture Setcion 14 said to remove this.
  //   process.env.NODE_ENV !== 'production'
  //     ? false
  //     : { rejectUnauthorized: false },
});

//event handler for all errors
pgClient.on('error', () => console.log('Lost PG connection'));

//any time we connect to a sql type database, we have to initially create at 
// least one time a table (table name is values) that is going to store all of the values of the indexs that are submitted. 
// if that table doesn't already exist.

//event handler for pg connect 
pgClient.on('connect', (client) => {
  client
    .query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch((err) => console.error(err));
});

//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * Redis Client Setup
const redis = require('redis');
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});


//according to the redis documentation for this javascript library, 
//if we ever have a client thats listening or publishing information (worker will be listening)
//on redis, we have to make a duplicate connection that can not be used for other purposes.
//We do this in both locations. (worker)
const redisPublisher = redisClient.duplicate();


//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * Express route handlers
//He says he wanted to make a test route as something we could use to make sure our application is working the way we expect, but then he never shows how to use it.
//I played around and figured it out.
//The answer is to open the docker-compose.yml file, add a port mapping to the  apifoo container service. (This is actually the Express server folder > index.js) 
// ports:
//   - '3050:5000'
// And remove the 3050:80 port mapping from the nginx container service in the docker-compose.yml.
// then from the terminal   docker compose up --build
//So now the application opens from http://localhost:3050 and the Browser displays 'Hi'.
app.get('/', (req, res) => {
  res.send('Hi');
});

//I tried to make the fib from React call this api, but, I never get here no matter what I tried. Just wanted to try.
// app.get('/', async (req, res) => {
//   //I just stuck this on here to get a result
//   const values = await pgClient.query("SELECT * from values");
//   console.log(`Will I see this somewhere????`);
//   res.send('Hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii');
// });

//look at the values table and retrieve everything out of it
//The React app made a http request to  axios.get('/api/values/all'), that got intercepted by nginx, which then stripped off 'api' and that gets us here
app.get('/values/all', async (req, res) => {
  console.log(`PostgreSQL arrived at /values/all`);
  const values = await pgClient.query("SELECT * from values");
  //the rows key word slims down the return to only data and not date, num count, and run time etc. that often comes back after a sql executes
  res.send(values.rows);
});

//The React app made a http request to  axios.get('/api/values/current'), that got intercepted by nginx, which then stripped off 'api' and that gets us here
app.get('/values/current', async (req, res) => {
  console.log(`redisClient arrived at /values/current`);
  //look at a hash value inside the redis instance and get all the information from it
  //NOTE: the redis library for node js doesn't have out of the box promise support
  //which is why we are using a callback rather than making use of nice async await syntax.
  redisClient.hgetall('values', (err, values) => {
    res.send(values);
  });
});


//The React app made a http request to  axios.post('/api/values'), that got intercepted by nginx, which then stripped off 'api' and that gets us here
//new values from the react application
app.post('/values', async (req, res) => {

  //extract index from the http request body
  const index = req.body.index;

  //protect against the user entering a gigantic index value causes the
  //fib calculation logic to run for 3 centuries, which we don't want
  if (parseInt(index) > 40) {
    return res.status(422).send('index too high');
  }

  //The only other place that does a write to the redis database is in the worker, and uses this very syntax.
  //The purpose of this is to have something in the redis database the first time we run the application
  //so that there is something to put on the screen.
  //put index into redis data store, will replace the 'Nothing yet' 
  redisClient.hset('values', index, 'Nothing yet');

  //this how to fire off an event?
  //message that gets sent over to the worker process, firing off worker process event handler for insert
  //'insert' could just as well be 'foo'. So, the worker container will react to this event and make an entry into the
  //redis database.
  redisPublisher.publish('insert', index);

  //It seems to me that values is a stupid name for a fucking table, since VALUES is also a key word of the INSERT statement.
  //add in the new index into the number column that was just submitted and
  //permanently store it inside of postgres database
  //I am guessing that $1 is a placeholder for an argument. For example, I expect more than one data item might work like this. . .
  //pgClient.query('INSERT INTO values(number, number) VALUES($1), ($2)', [index, index]);  I don't know since I never used redis before now.
  pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

  //send back a response that indicates we are doing some work to make the calculation happen.
  //Maybe I can check for this back at the React Api call to prove that I got here.
  res.send({ working: true });
});

//This actually is necessary to tell Express to listen on a Port. Won't work without this.
app.listen(5000, err => {
  console.log('Listening for port 5000');
});



//NOTE you can do a sanity check of this code by returning to the terminal window for this directory and run 'node index.js'
// I just realized that when you use npm start, it is the package.json that maps 'start' to 'node index.js', so that on the 
// terminal prompt, you can just type 'node index.js' instead of npm start.
