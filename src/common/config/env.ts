import dotenv from 'dotenv';

dotenv.config();

/**
 * Environment variables required for all environments (dev, testing, staging, production)
 */
const requiredVariables = [
  'port',
  'amqp_url',
  'mongodb_url',
  'redis_url',
  'gateman_key'
];

/**
 * Environment variables required for both staging and production
 */
const productionAndStagingVariables = [
  'mongodb_username',
  'mongodb_password',
  'redis_password'
];

/**
 * Requires MongoDB and Redis credentials in production and staging, else uses Redis and MongoDB connection string directly
 * in dev or any other environment
 */
if (['production', 'staging'].includes(process.env.NODE_ENV))
  requiredVariables.push(...productionAndStagingVariables);

const env = {
  api_version: process.env.API_VERSION || '/api/v1',
  amqp_url: process.env.AMQP_URL,
  port: Number(process.env.PORT),
  redis_url: process.env.REDIS_URL,
  mongodb_url: process.env.MONGODB_URL,
  redis_password: process.env.REDIS_PASSWORD,
  app_env: process.env.NODE_ENV || 'development',
  mongodb_password: process.env.MONGODB_PASSWORD,
  mongodb_username: process.env.MONGODB_USERNAME,
  gateman_key: process.env.GATEMAN_KEY,
  salt_rounds: Number(process.env.SALT_ROUNDS) || 10,
  service_name: process.env.SERVICE_NAME || 'tharwa-user-accounts'
};

const missingVariables = requiredVariables.reduce((acc, variable) => {
  const isVariableMissing = !env[variable];
  return isVariableMissing ? acc.concat(variable.toUpperCase()) : acc;
}, []);

if (!!missingVariables.length)
  throw new Error(
    `The following required variables are missing: ${missingVariables}}`
  );

export default env;
