//This is node js javascript code

//connection keys he called them
const keys = require('./keys');
//import a redis client 
const redis = require('redis');

//We are only using Redis in the worker container

//* * * * * * * * * * * * * * * * * * * * * * * * * * * * * Redis Client Setup

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});

//according to the redis documentation for this javascript library, 
//if we ever have a client thats listening or publishing information 
//on redis, we have to make a duplicate connection that can not be used for other purposes.
//We do this in both locations. (worker)
const redisPublisher = redisClient.duplicate();


//runs anytime we see a new value
//fibinaci recursive solution
//tends to be slow, which is needed by design to simulate why
//we might want a seperate worker process
function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

//this is an event handler (.on)
//anytime we get a new value, that shows up in redis run this callback function
//to calculate a new fib value and insert that into a hash (.hset) of values in redis.
//message is the index value that was submitted into the form
redisPublisher.on('message', (channel, message) => {
  console.log(`redisClient event handler for insert : ${message}`);
  redisClient.hset('values', message, fib(parseInt(message)));
});

//At Line 138 index.js  of the server container is what fires (publishes) this event
//register event that listens for insert ()
//'insert' could just as well be 'foo'
redisPublisher.subscribe('insert');

//NOTE you can do a sanity check of this code by returning to the terminal window for this directory and run 'node index.js'
// I just realized that when you use npm start, it is the package.json that maps 'start' to 'node index.js', so that on the 
// terminal prompt, you can just type 'node index.js' instead of npm start.
