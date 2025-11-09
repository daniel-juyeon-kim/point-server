import { ConfigModule, registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  type: 'mysql' as const,
  host: process.env.DB_HOST,
  port: parseInt(String(process.env.DB_PORT)),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
}));

export const rootConfigModule = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: '.env',
  load: [databaseConfig],
});
