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
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from '../../schemas/category.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { TenantRequest } from '../../interfaces/tenant-request.interface';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../../decorators/public.decorator';
import { Types } from 'mongoose';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // Bu yöntem tenant olup olmadığını kontrol eder
  // Public metodlar için sistem default tenant ID kullanabilir
  private getTenantId(req: TenantRequest): string {
    // Tenant varsa tenant id'yi dön
    if (req.tenant && req.tenant._id) {
      return req.tenant._id.toString();
    }

    // x-tenant-id header'ı varsa onu dön
    const tenantHeader = req.headers['x-tenant-id'];
    if (tenantHeader) {
      return tenantHeader.toString();
    }

    // Hiçbir tenant bilgisi yoksa hata fırlat
    throw new UnauthorizedException('Tenant bilgisi bulunamadı');
  }

  @Post()
  @ApiOperation({ summary: 'Yeni kategori oluştur' })
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Request() req: TenantRequest,
    @Body() createCategoryDto: Partial<Category>,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<Category> {
    const tenantId = this.getTenantId(req);
    return this.categoryService.create(tenantId, createCategoryDto, image);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Tüm kategorileri getir' })
  async findAll(@Request() req: TenantRequest): Promise<Category[]> {
    try {
      const tenantId = this.getTenantId(req);
      return this.categoryService.findAllByTenant(tenantId);
    } catch (error) {
      // Tenant bilgisi yoksa boş dizi dön
      console.warn('Tenant bilgisi olmadan kategori listesi istendi');
      return [];
    }
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'ID ile kategori getir' })
  async findOne(@Request() req: TenantRequest, @Param('id') id: string): Promise<Category> {
    try {
      const tenantId = this.getTenantId(req);
      return this.categoryService.findOne(tenantId, id);
    } catch (error) {
      throw new UnauthorizedException('Kategori bilgisi için tenant gereklidir');
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Kategori güncelle' })
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Request() req: TenantRequest,
    @Param('id') id: string,
    @Body() updateCategoryDto: Partial<Category>,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<Category> {
    const tenantId = this.getTenantId(req);
    return this.categoryService.update(tenantId, id, updateCategoryDto, image);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Kategori sil' })
  async remove(@Request() req: TenantRequest, @Param('id') id: string): Promise<Category> {
    const tenantId = this.getTenantId(req);
    return this.categoryService.remove(tenantId, id);
  }

  @Put('order/bulk')
  @ApiOperation({ summary: 'Kategori sıralamasını güncelle' })
  async updateOrder(
    @Request() req: TenantRequest,
    @Body() categories: { id: string; order: number }[],
  ): Promise<void> {
    const tenantId = this.getTenantId(req);
    return this.categoryService.updateOrder(tenantId, categories);
  }
}
