const redis = require('redis');

const redisClient =  redis.createClient({
    url: 'redis://@redis:6379'
  });

redisClient.connect();

// Set data in Redis
async function setData(key, value ) {
    await redisClient.set(key, JSON.stringify(value));
}

// Get data from Redisa
async function getData(key) {
    return await redisClient.get(key);
}

// Close Redis connection
function quit() {
   
    redisClient.quit();
}

module.exports = {
    setData,
    getData,
    quit
};
