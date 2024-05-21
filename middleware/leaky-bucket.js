import Redis from "ioredis";
import moment from "moment";

const redisClient = new Redis();

const BUCKET_CAPACITY = 5;
const REFILL_RATE = 4 / 20; // Tokens per second
const LEAKY_BUCKET_KEY_PREFIX = "leaky_bucket_";

// Queue to store pending requests
const requestQueue = [];

const leakyBucket = async (req, res, next) => {
  const userId = req.params.userId;
  const currentTime = moment().unix();

  // Calculate the key for the leaky bucket in Redis
  const bucketKey = `${LEAKY_BUCKET_KEY_PREFIX}${userId}`;

  // Get the current number of tokens in the bucket
  const storedTokens = (await redisClient.get(bucketKey)) || 0;

  // Calculate the number of tokens to add since the last request
  const elapsedTime =
    currentTime -
    ((await redisClient.get(`${bucketKey}_lastRequestTime`)) || 0);
  const tokensToAdd = Math.floor(elapsedTime * REFILL_RATE);

  // Update the last request time
  await redisClient.set(`${bucketKey}_lastRequestTime`, currentTime);

  // Add tokens to the bucket, but don't exceed the capacity
  const newTokens = Math.min(
    BUCKET_CAPACITY,
    parseInt(storedTokens) + tokensToAdd
  );
  await redisClient.set(bucketKey, newTokens);

  // Check if there are enough tokens for the current request
  if (newTokens >= 1) {
    // Consume one token
    await redisClient.set(bucketKey, newTokens - 1);
    return next();
  } else {
    // Store the request in the queue
    requestQueue.push({ req, res, next });
    console.log(`User ${userId} request queued. Insufficient tokens.`);
  }
};

// Function to process queued requests
const processQueue = async () => {
  if (requestQueue.length > 0) {
    const { req, res, next } = requestQueue.shift();
    await leakyBucket(req, res, next);
    // Continue processing the queue recursively
    processQueue();
  }
};

// Run processQueue periodically to process pending requests
setInterval(processQueue, 1000); // Adjust the interval as needed

export { leakyBucket };
