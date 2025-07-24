import * as bcrypt from 'bcrypt';
import configuration from 'src/config/configuration';

const passwordHash = async (password: any) => {
  console.log({ password, configuration: configuration().bcrypt_salt_rounds });
  // CONVERT TO HASH PASSWORD
  const passwordHash = await bcrypt.hash(
    password,
    Number(configuration().bcrypt_salt_rounds),
  );

  return passwordHash;
};

const passwordMatch = async (password: string, password_hash: string) => {
  return await bcrypt.compare(password, password_hash);
};

export const PasswordHelpers = {
  passwordHash,
  passwordMatch,
};
