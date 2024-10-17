const { setETag } = require("../services/cache");

// cachingMiddleware factory function that accepts a custom parameter
const cachingMiddleware = (cacheName, cacheId) => {
  return async (req, res, next) => {
    try {
      // console.log("cachingMiddleware");
      // Use the custom parameter (e.g., 'task') in the logic
      const cacheKey = `${cacheName}:${req.params[cacheId]}`; // Example cache key

      const cacheObj = {};
      // Check cache for the given key (this is just an example, actual caching logic may vary)
      cacheObj[cacheName] = await global.redisClient.get(cacheKey);
      if (cacheObj[cacheName]) {
        // ETag support - Use hash to verify if data changed
        const etag = await setETag(cacheObj[cacheName]);
        // console.log("etag", etag);
        // console.log(req.headers["if-none-match"]);

        // If client's ETag matches, send 304 (Not Modified)
        if (req.headers["if-none-match"] === etag) {
          console.info("304 Not Modified");
          return res.status(304).end();
        }

        res.setHeader("ETag", etag);
        return res
          .status(200)
          .json({ [cacheName]: JSON.parse(cacheObj[cacheName]) }); // Return cached data if found
      }

      // If no cache, proceed to next middleware or controller
      next();
    } catch (error) {
      res
        .status(500)
        .json({ message: "An error occurred in caching middleware.", error });
    }
  };
};

module.exports = cachingMiddleware;
