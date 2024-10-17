const crypto = require("crypto");
const { createClient } = require("redis");

let client;

exports.redisClient = () => {
  client = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
    // password: process.env.REDIS_PASSWORD,
    // socket: {
    //   host: process.env.REDIS_URL,
    //   port: process.env.REDIS_PORT,
    // },
  });

  client.on("error", (err) => console.error("Redis Client Error", err));

  client.connect();

  return client;
};

// Set cache data
exports.setCache = async (cacheName, key, data) => {
  const cacheKey = `${cacheName}:${key}`;
  // console.log("cacheKey", cacheKey);
  await client.set(cacheKey, JSON.stringify(data), { EX: 60 }); // Cache for 2 minutes
  // await client.set(cacheKey, JSON.stringify(data), { EX: 3600 }); // Cache for 1 hour
};

// Set ETag for response
exports.setETag = async (data) => {
  const etag = crypto
    .createHash("md5")
    .update(JSON.stringify(data))
    .digest("hex");
  return etag;
};
