const ENV = process.env.NODE_ENV?.trim();

export const envConfiguration = {
  envFilePath: !ENV ? '.env' : `.env.${ENV}`
};
