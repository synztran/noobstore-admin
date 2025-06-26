import { REDIS_HOST } from "@/systemconfig";
import Redis from "ioredis";

const redis = new Redis(REDIS_HOST || "redis://localhost:6379");

export default redis;
