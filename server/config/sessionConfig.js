const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');

// Create Redis client
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retry_strategy: function(options) {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      return new Error('The server refused the connection');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      return new Error('Retry time exhausted');
    }
    if (options.attempt > 10) {
      return undefined;
    }
    return Math.min(options.attempt * 100, 3000);
  }
});

// Event handlers
redisClient.on('connect', () => {
  console.log('✅ Redis client connected');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis client error:', err);
});

redisClient.on('ready', () => {
  console.log('✅ Redis client ready');
});

// Connect to Redis (optional for v3 - it auto-connects)
// redisClient.connect() is not needed for redis v3

const sessionConfig = {
  store: new RedisStore({ 
    client: redisClient,
    prefix: 'session:',
    ttl: 86400 // 24 hours in seconds
  }),
  secret: process.env.SESSION_SECRET || 'your-secure-session-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  },
  name: 'authSession',
  rolling: true
};

module.exports = sessionConfig;