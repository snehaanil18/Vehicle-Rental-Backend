import Redis from 'ioredis'

const redis = new Redis({
    host: process.env.REDIS_HOST || 'redis', // Use your Redis host
    port: process.env.REDIS_PORT || 6379,    // Use your Redis port
  });

export default redis;