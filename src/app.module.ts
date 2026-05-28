import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { CatalogModule } from './catalog/catalog.module';
import { CollectionModule } from './collection/collection.module';
import { DecksModule } from './decks/decks.module';
import { EventsModule } from './events/events.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const useSSL      = configService.get('DB_SSL') === 'true'
        const databaseUrl = configService.get<string>('DATABASE_URL')
        const host        = configService.get<string>('DB_HOST') ?? ''
        const endpointId  = host.split('.')[0]

        const base = {
          type: 'postgres' as const,
          autoLoadEntities: true,
          synchronize: configService.get('NODE_ENV') !== 'production',
        }

        if (databaseUrl) {
          return { ...base, url: databaseUrl, ssl: { rejectUnauthorized: false } }
        }

        return {
          ...base,
          host,
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          ssl: useSSL ? { rejectUnauthorized: false } : false,
          extra: useSSL ? { options: `endpoint=${endpointId}` } : undefined,
        }
      },
    }),
    AuthModule,
    UsersModule,
    CatalogModule,
    CollectionModule,
    DecksModule,
    EventsModule,
  ],
  providers: [
    // Guard global: todas las rutas requieren JWT salvo las marcadas con @IsPublic()
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
