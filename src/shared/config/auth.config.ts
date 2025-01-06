import { env } from './env.config';

export const authConfig = {
  accessTokenExpiresIn: parseInt(env.ACCESS_TOKEN_EXPIRES_IN || "3600", 10),
  refreshTokenExpiresIn: parseInt(env.REFRESH_TOKEN_EXPIRES_IN || "604800", 10),
};
