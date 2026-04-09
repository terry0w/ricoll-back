import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogModule } from './catalog/catalog.module';

@Module({
  imports: [
    // 1. Cargamos el módulo de configuración
    ConfigModule.forRoot({
      isGlobal: true, // Para que esté disponible en todos tus módulos sin re-importar
    }),

    // 2. Usamos forRootAsync para esperar a que las variables se carguen
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<string>('DB_TYPE') as any,
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true, // Recuerda: en producción esto debe ser false
      }),
    }),
    CatalogModule,
  ],
})
export class AppModule {}