import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT,
  db: {
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  }
};
