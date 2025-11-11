import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from './api/api.module';
import { databaseConfig, rootConfigModule } from './config/config.module';
import { RepositoryModule } from './database/repository.module';

@Module({
  imports: [
    ApiModule,
    rootConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(databaseConfig)],
      inject: [databaseConfig.KEY],
      useFactory: (dbConfig: ConfigType<typeof databaseConfig>) => ({
        ...dbConfig,
        entities: [__dirname + '/**/*.entity.{ts,js}'],
      }),
    }),
    RepositoryModule,
  ],
})
export class AppModule {}
