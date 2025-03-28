//environment variables. These get there values from settings in the docker-compose.yml
module.exports = {
  redisHost: process.env.REDIS_HOST,  //Sort of like a URL
  redisPORT: process.env.REDIS_PORT,  //Sort of like a URL
  pgHost: process.env.PGHOST,         //Sort of like a URL
  pgPort: process.env.PGPORT,         //Sort of like a URL
  pgUser: process.env.PGUSER,
  pgDatabase: process.env.PGDATABASE,
  pgPassword: process.env.PGPASSWORD
};
