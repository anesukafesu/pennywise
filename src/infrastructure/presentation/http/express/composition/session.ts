import session from "express-session";
import { RedisStore } from "connect-redis";
import { createClient } from "redis";

const SESSION_DURATION = 14 * 24 * 60 * 60 * 1000; // 14 days

export async function createSessionMiddleware() {
  const redisClient = createClient({
    url: process.env.REDIS_URL,
  });

  await redisClient.connect();

  const sessionMiddleware = session({
    name: "pennywise.sid",
    store: new RedisStore({
      client: redisClient,
      prefix: "sessions:",
      ttl: SESSION_DURATION,
    }),
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "none",
    },
  });

  return sessionMiddleware;
}
