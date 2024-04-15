import {ConfigModule, ConfigService} from '@nestjs/config';
import {SECONDS_IN_A_DAY} from '../const/jwt.const';

export const jwtConfig = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => ({
    secret: config.get<string>('JWT_SECRET')
  }),
  signOptions: {expiresIn: SECONDS_IN_A_DAY}
};
