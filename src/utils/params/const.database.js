import dotenv from 'dotenv';
dotenv.config();

export const variablesDB = ({
  name_db: process.env.NAME_CONNECTION,
})
