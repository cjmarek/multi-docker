//environment variables. These get there values from settings in the docker-compose.yml
module.exports = {
  redisHost: process.env.REDIS_HOST, //Sort of like a URL
  redisPORT: process.env.REDIS_PORT,  //Sort of like a URL
};
