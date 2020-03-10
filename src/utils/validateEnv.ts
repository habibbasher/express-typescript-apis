import {
  cleanEnv, port, str,
} from 'envalid';

function validateEnv() {
  cleanEnv(process.env, {
    JWT_SECRET: str(),
    HOST_NAME: str(),
    DB_NAME: str(),
    PORT: port(),
  });
}

export default validateEnv;
