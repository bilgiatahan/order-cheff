import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product, ProductSchema } from '../../schemas/product.schema';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { Category, CategorySchema } from '../../schemas/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
    CloudinaryModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
