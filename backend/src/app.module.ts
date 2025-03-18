import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TenantModule } from './modules/tenant/tenant.module';
import { ProductModule } from './modules/product/product.module';
import { CategoryModule } from './modules/category.module';
import { TenantMiddleware } from './middleware/tenant.middleware';
import { SubdomainMiddleware } from './middleware/subdomain.middleware';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { MenuModule } from './modules/menu/menu.module';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60, // 60 saniye cache süresi
      max: 100, // maksimum 100 key saklanabilir
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    TenantModule,
    ProductModule,
    CategoryModule,
    CloudinaryModule,
    MenuModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    // Önce subdomain middleware'ini uygula
    consumer.apply(SubdomainMiddleware).forRoutes('*');

    // Sonra tenant middleware'ini belirli routelara uygula
    consumer
      .apply(TenantMiddleware)
      .exclude('tenants/(.*)', 'auth/(.*)', 'menu/mock-data') // Tenant, auth ve mock-data endpointlerini hariç tut
      .forRoutes('*'); // Tüm diğer routelara uygula
  }
}
