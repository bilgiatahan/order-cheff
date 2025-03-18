import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TenantService } from '../services/tenant.service';
import { Tenant } from '../schemas/tenant.schema';
import { Promise } from 'mongoose';

@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  async create(@Body() createTenantDto: Partial<Tenant>): Promise<Tenant> {
    return this.tenantService.create(createTenantDto);
  }

  @Get()
  async findAll(): Promise<Tenant[]> {
    return this.tenantService.findAll();
  }

  @Get(':subdomain')
  async findBySubdomain(@Param('subdomain') subdomain: string): Promise<Tenant | null> {
    return this.tenantService.findBySubdomain(subdomain);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTenantDto: Partial<Tenant>,
  ): Promise<Tenant | null> {
    return this.tenantService.update(id, updateTenantDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Tenant | null> {
    return this.tenantService.remove(id);
  }
}
