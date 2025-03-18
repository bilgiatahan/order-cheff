import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { MenuService } from './menu.service';
import { Menu, MenuItem } from '@schemas/menu.schema';
import { TenantData } from '@/interfaces/tenant-request.interface';
import { Tenant } from '@/decorators/tenant.decorator';
import { Public } from '../../decorators/public.decorator';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Public()
  @Post()
  async create(@Tenant() tenant: TenantData, @Body() createMenuDto: Partial<Menu>): Promise<Menu> {
    return this.menuService.create(tenant._id.toString(), createMenuDto);
  }

  @Public()
  @Get()
  async findAll(@Tenant() tenant: TenantData): Promise<Menu[]> {
    return this.menuService.findAllByTenant(tenant._id.toString());
  }

  @Public()
  @Get(':id')
  async findOne(@Tenant() tenant: TenantData, @Param('id') id: string): Promise<Menu> {
    return this.menuService.findOne(tenant._id.toString(), id);
  }

  @Public()
  @Put(':id')
  async update(
    @Tenant() tenant: TenantData,
    @Param('id') id: string,
    @Body() updateMenuDto: Partial<Menu>,
  ): Promise<Menu> {
    return this.menuService.update(tenant._id.toString(), id, updateMenuDto);
  }

  @Public()
  @Delete(':id')
  async remove(@Tenant() tenant: TenantData, @Param('id') id: string): Promise<Menu> {
    return this.menuService.remove(tenant._id.toString(), id);
  }

  @Public()
  @Post(':id/categories/:categoryId')
  async addCategory(
    @Tenant() tenant: TenantData,
    @Param('id') id: string,
    @Param('categoryId') categoryId: string,
  ): Promise<Menu> {
    return this.menuService.addCategory(tenant._id.toString(), id, categoryId);
  }

  @Public()
  @Delete(':id/categories/:categoryId')
  async removeCategory(
    @Tenant() tenant: TenantData,
    @Param('id') id: string,
    @Param('categoryId') categoryId: string,
  ): Promise<Menu> {
    return this.menuService.removeCategory(tenant._id.toString(), id, categoryId);
  }

  @Public()
  @Get('category/:category')
  async findByCategory(@Param('category') category: string): Promise<MenuItem[]> {
    return this.menuService.findByCategory(category);
  }

  @Public()
  @Post('mock-data')
  async createMockData(): Promise<{ message: string }> {
    await this.menuService.createMockData();
    return { message: 'Mock data başarıyla oluşturuldu!' };
  }
}
