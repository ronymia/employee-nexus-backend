export default () => ({
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  // DEFAULT PASSWORD
  default_password: {
    super_admin: process.env.DEFAULT_SUPER_ADMIN_PASS,
    business_owner: process.env.DEFAULT_BUSINESS_OWNER_PASS,
    admin: process.env.DEFAULT_ADMIN_PASS,
    manager: process.env.DEFAULT_MANAGER_PASS,
    employee: process.env.DEFAULT_EMPLOYEE_PASS,
  },
  // AUTH
  jwt: {
    access_token: process.env.JWT_ACCESS_TOKEN,
    refresh_token: process.env.JWT_REFRESH_TOKEN,
    access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  },
});

export const envKey = {
  node_env: 'NODE_ENV',
  port: 'PORT',
  database_url: 'DATABASE_URL',
  bcrypt_salt_rounds: 'BCRYPT_SALT_ROUNDS',
  // DEFAULT PASSWORD
  default_password: {
    super_admin: 'DEFAULT_SUPER_ADMIN_PASS',
    business_owner: 'DEFAULT_BUSINESS_OWNER_PASS',
    admin: 'DEFAULT_ADMIN_PASS',
    manager: 'DEFAULT_MANAGER_PASS',
    employee: 'DEFAULT_EMPLOYEE_PASS',
  },
  // AUTH
  jwt: {
    access_token: 'JWT_ACCESS_TOKEN',
    refresh_token: 'JWT_REFRESH_TOKEN',
    access_expires_in: 'JWT_ACCESS_EXPIRES_IN',
    refresh_expires_in: 'JWT_REFRESH_EXPIRES_IN',
  },
};
