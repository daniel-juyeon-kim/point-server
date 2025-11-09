import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from './api/api.module';
import { databaseConfig, rootConfigModule } from './config/config.module';

@Module({
  imports: [
    ApiModule,
    rootConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(databaseConfig)],
      inject: [databaseConfig.KEY],
      useFactory: (dbConfig: ConfigType<typeof databaseConfig>) => ({
        ...dbConfig,
        entities: [__dirname + '/api/**/*.entity.{ts,js}'],
      }),
    }),
  ],
})
export class AppModule {}
