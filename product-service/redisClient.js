const redis = require('redis');
require('dotenv').config();



const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://redis:6379'
});

client.on('error', err => console.error('Redis Client Error:', err));
client.on('connect', () => console.log('Redis connected'));

(async () => {
  try {
    await client.connect();
  } catch (err) {
    console.error('Redis connect error:', err.message);
  }
})();

module.exports = client;
