import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { Tenant } from '../../schemas/tenant.schema';
import { Public } from '../../decorators/public.decorator';

@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Public()
  @Post()
  async create(@Body() createTenantDto: Partial<Tenant>): Promise<Tenant> {
    return this.tenantService.create(createTenantDto);
  }

  @Public()
  @Get()
  async findAll(): Promise<Tenant[]> {
    return this.tenantService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Tenant> {
    return this.tenantService.findOne(id);
  }

  @Get('subdomain/:subdomain')
  async findBySubdomain(@Param('subdomain') subdomain: string): Promise<Tenant> {
    return this.tenantService.findBySubdomain(subdomain);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTenantDto: Partial<Tenant>): Promise<Tenant> {
    return this.tenantService.update(id, updateTenantDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Tenant> {
    return this.tenantService.remove(id);
  }
}
