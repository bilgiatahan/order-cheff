import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tenant, TenantSchema } from './schemas/tenant.schema';
import { Menu, MenuSchema } from '../../schemas/menu.schema';
import { Category, CategorySchema } from '../../schemas/category.schema';
import { Product, ProductSchema } from '../../schemas/product.schema';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tenant.name, schema: TenantSchema },
      { name: Menu.name, schema: MenuSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [TenantController],
  providers: [TenantService],
  exports: [TenantService, MongooseModule],
})
export class TenantModule {}
