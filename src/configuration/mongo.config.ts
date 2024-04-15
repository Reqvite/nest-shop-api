import {ConfigModule, ConfigService} from '@nestjs/config';

export const mongoConfig = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => ({
    uri: config.get<string>('DB_HOST')
  })
};
