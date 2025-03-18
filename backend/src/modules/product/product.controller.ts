import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  Query,
  UnauthorizedException,
  Headers,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { Product } from '../../schemas/product.schema';
import { TenantData } from '../../interfaces/tenant-request.interface';
import { Tenant } from '../../decorators/tenant.decorator';
import { Public } from '../../decorators/public.decorator';
import { Types } from 'mongoose';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Header'dan tenant ID'yi al
  private getTenantIdFromHeader(tenantId?: string): string {
    if (!tenantId) {
      throw new UnauthorizedException('Tenant bilgisi bulunamadı');
    }
    return tenantId;
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Headers('x-tenant-id') headerTenantId: string,
    @Body() createProductDto: Partial<Product>,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<Product> {
    const tenantId = this.getTenantIdFromHeader(headerTenantId);
    return this.productService.create(tenantId, createProductDto, image);
  }

  @Public()
  @Get()
  async findAll(
    @Headers('x-tenant-id') headerTenantId: string,
    @Query('categoryId') categoryId?: string,
  ): Promise<Product[]> {
    try {
      const tenantId = this.getTenantIdFromHeader(headerTenantId);
      console.log('categoryId', categoryId);
      if (categoryId) {
        // Kategori ID'sinin geçerli bir ObjectId olup olmadığını kontrol et
        if (Types.ObjectId.isValid(categoryId)) {
          console.log(`Ürünler ObjectId kategori ID'sine göre getiriliyor: ${categoryId}`);
          return this.productService.findAllByCategory(tenantId, categoryId);
        } else {
          // Eğer geçerli bir ObjectId değilse, kategori adı olarak kabul edip adına göre arama yap
          console.log(
            `Kategori ID ObjectId formatında değil, kategori adı olarak aranıyor: "${categoryId}"`,
          );
          return this.productService.findAllByCategoryName(tenantId, categoryId);
        }
      }
      console.log(`Tüm ürünler getiriliyor - tenant: ${tenantId}`);
      return this.productService.findAllByTenant(tenantId);
    } catch (error) {
      console.error('Ürün listesi alınırken hata oluştu:', error);
      return [];
    }
  }

  @Public()
  @Get(':id')
  async findOne(
    @Headers('x-tenant-id') headerTenantId: string,
    @Param('id') id: string,
  ): Promise<Product> {
    try {
      const tenantId = this.getTenantIdFromHeader(headerTenantId);
      return this.productService.findOne(tenantId, id);
    } catch (error) {
      throw new UnauthorizedException('Ürün bilgisi için tenant gereklidir');
    }
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Tenant() tenant: TenantData,
    @Param('id') id: string,
    @Body() updateProductDto: Partial<Product>,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<Product> {
    return this.productService.update(tenant._id.toString(), id, updateProductDto, image);
  }

  @Delete(':id')
  async remove(@Tenant() tenant: TenantData, @Param('id') id: string): Promise<Product> {
    return this.productService.remove(tenant._id.toString(), id);
  }
}
