import { config } from 'dotenv';
import process from 'process';

config({path: `.env.${process.env.NODE_ENV || 'development'}.local`});

export const { PORT, NODE_ENV, DB_URI, JWT_SECRET, JWT_EXPIRES_IN, ARCJET_ENV, ARCJET_KEY } = process.env;
