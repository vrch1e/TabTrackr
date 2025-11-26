import TimeTracking from '../model/model.js';
import crypto from 'node:crypto'
import { Redis } from '@upstash/redis'
import dotenv from 'dotenv'
dotenv.config()

async function saveVisits(visits) {
  if (!Array.isArray(visits['usage'])) throw new Error("Expected an array of visits");

  await Promise.all(
    visits['usage'].map(async ({ userId, site, timespent, url }) => {
      await TimeTracking.create({ userId, site, timespent, url });
    })
  );
}

async function createSession() {
  const token = crypto.randomBytes(32).toString("hex");
  try {
      const redis = new Redis({
          url: process.env.REDIS_URL,
          token: process.env.REDIS_TOKEN,
      })
      await redis.set(token, userId, {ex: 600})
      console.log('set token successfully: ', token)
      return token;
  } catch (err) {
      console.log('fatass error with url or redis token, ', err)
  }
}

export default { saveVisits, createSession }