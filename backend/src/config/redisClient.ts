import { createClient } from "redis";

const redisClient = createClient({
  url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));
redisClient.connect();

export const getTasksFromRedis = async (): Promise<string[]> => {
  try {
    const tasks = await redisClient.get(
      `FULLSTACK_TASK_${process.env.USERNAME}`
    );
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error("Error getting tasks from Redis:", error);
    return [];
  }
};

export const setTasksInRedis = async (tasks: string[]): Promise<void> => {
  try {
    await redisClient.set(
      `FULLSTACK_TASK_${process.env.USERNAME}`,
      JSON.stringify(tasks)
    );
  } catch (error) {
    console.error("Error setting tasks in Redis:", error);
  }
};

export const flushTasksFromRedis = async (): Promise<void> => {
  try {
    await redisClient.del(`FULLSTACK_TASK_${process.env.USERNAME}`);
  } catch (error) {
    console.error("Error flushing tasks from Redis:", error);
  }
};
