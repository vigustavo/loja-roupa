import dotenv from 'dotenv';

dotenv.config();

const requiredVars = ['PORT', 'JWT_SECRET'];

requiredVars.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`Environment variable ${key} is not set. Using default value.`);
  }
});

export const env = {
  port: Number(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'super-secret-development-key'
};
