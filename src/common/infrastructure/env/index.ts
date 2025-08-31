import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number().default(3000),
  API_URL: z.string().default('http://localhost:3000'),
  DB_TYPE: z.literal('postgres').default('postgres'),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(5432),
  DB_SCHEMA: z.string().default('public'),
  DB_NAME: z.string().default('postgres'),
  DB_USERNAME: z.string().default('postgres'),
  DB_PASSWORD: z.string().default('123'),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('Environment validation errors:', _env.error.format())
  throw new Error('Invalid environment variables')
}

export const env = _env.data
