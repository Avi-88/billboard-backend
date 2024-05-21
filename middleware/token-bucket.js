import Redis from 'ioredis';
import moment from 'moment';

const redisClient = new Redis({ url: "redis://localhost:6380" });

const TOKEN_BUCKET_CAPACITY = 5;
const TOKEN_FILL_RATE = 4 / 20; // Tokens per second

export const tokenBucketLimiter = async (req, res, next) => {
    const userId = req.body.userId;
    // Get the current time and the number of tokens in the bucket
    const currentTime = moment().unix();
    const storedTokens = await redisClient.get(userId + "_tokens") || 0;

    // Calculate the number of tokens to add since the last request
    const elapsedTime = currentTime - (await redisClient.get(userId + "_lastRequestTime") || 0);
    const tokensToAdd = Math.floor(elapsedTime * TOKEN_FILL_RATE);

    // Update the last request time
    await redisClient.set(userId + "_lastRequestTime", currentTime);

    // Add tokens to the bucket, but don't exceed the capacity
    const newTokens = Math.min(TOKEN_BUCKET_CAPACITY, parseInt(storedTokens) + tokensToAdd);
    await redisClient.set(userId + "_tokens", newTokens);

    // Check if there are enough tokens for the current request
    if (newTokens >= 1) {
        // Consume one token
        await redisClient.set(userId + "_tokens", newTokens - 1);
        return next();
    } else {
        console.log(`User ${userId} is rate-limited. Insufficient tokens.`);
        return res.status(429).json({
            "success": false,
            "message": "User is rate-limited. Insufficient tokens."
        });
    }
};
