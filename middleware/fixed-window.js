import Redis from "ioredis";
import moment from "moment";

const redisClient = new Redis();

const RATELIMIT_DURATION_IN_SECONDS = 60;
const NUMBER_OF_REQUEST_ALLOWED = 5;

export const rateLimiter = async (req, res, next) => {
  const userId = req.params.userId;
  const currentTime = moment().unix();

  const result = await redisClient.hgetall(userId);
  if (Object.keys(result).length === 0) {
    await redisClient.hset(userId, {
      createdAt: currentTime,
      count: 1,
    });
    return next();
  }
  if (result) {
    let diff = currentTime - result["createdAt"];

    if (diff > RATELIMIT_DURATION_IN_SECONDS) {
      console.log("first hash hit");
      await redisClient.hset(userId, {
        createdAt: currentTime,
        count: 1,
      });
      return next();
    }
  }
  if (result["count"] >= NUMBER_OF_REQUEST_ALLOWED) {
    console.log(`User ${userId} has reached the rate limit.`);
    return res.status(429).json({
      success: false,
      message: "user is rate limited",
    });
  } else {
    console.log("hash hit");
    await redisClient.hset(userId, {
      count: parseInt(result["count"]) + 1,
    });
    return next();
  }
};
