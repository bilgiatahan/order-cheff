import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { Product } from '../schemas/product.schema';
import { Promise } from 'mongoose';
import { CategoryService } from '../services/category.service';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
  ) {}

  @Post()
  async create(@Body() createProductDto: Partial<Product>): Promise<Product> {
    return this.productService.create(createProductDto);
  }

  @Get()
  async findAll(@Query('tenantId') tenantId: string): Promise<Product[]> {
    return this.productService.findAll(tenantId);
  }

  @Get('search')
  async search(
    @Query('tenantId') tenantId: string,
    @Query('term') searchTerm: string,
  ): Promise<Product[]> {
    return this.productService.search(tenantId, searchTerm);
  }

  @Get('category/:category')
  async findByCategory(
    @Query('tenantId') tenantId: string,
    @Param('category') category: string,
  ): Promise<Product[]> {
    // MongoDB ObjectId olup olmadığını kontrol et
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(category);

    if (isValidObjectId) {
      // Kategori ID ise doğrudan kullan
      return this.productService.findByCategory(tenantId, category);
    } else {
      // Kategori adı ise, önce ilgili kategoriyi bul
      // Burada kategori adını kullanarak tüm kategorileri getirebilir ve
      // adına göre filtreleme yapabiliriz. Bu örnek için basitleştiriyorum.
      // Normalde daha verimli bir yaklaşım gerekebilir.
      const categories = await this.categoryService.findAll(tenantId);
      const matchingCategory = categories.find((cat) => cat.name === category);

      if (!matchingCategory) {
        throw new NotFoundException(`Category with name "${category}" not found`);
      }

      // TypeScript, Mongoose dökümanında _id özelliğini tanımıyor, bu yüzden as any kullanıyoruz
      // veya daha güvenli bir yaklaşım olarak `matchingCategory.id` ya da `matchingCategory['_id']` kullanılabilir
      const categoryId = (matchingCategory as any)._id?.toString();
      return this.productService.findByCategory(tenantId, categoryId);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product | null> {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: Partial<Product>,
  ): Promise<Product | null> {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Product | null> {
    return this.productService.remove(id);
  }
}
