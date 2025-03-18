import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tenant, TenantDocument } from '../../schemas/tenant.schema';

@Injectable()
export class TenantService {
  constructor(@InjectModel(Tenant.name) private tenantModel: Model<TenantDocument>) {}

  async create(createTenantDto: Partial<Tenant>): Promise<Tenant> {
    const createdTenant = new this.tenantModel(createTenantDto);
    return createdTenant.save();
  }

  async findAll(): Promise<Tenant[]> {
    return this.tenantModel.find().exec();
  }

  async findOne(id: string): Promise<Tenant> {
    const tenant = await this.tenantModel.findById(id).exec();
    if (!tenant) {
      throw new NotFoundException(`ID: ${id} olan işletme bulunamadı`);
    }
    return tenant;
  }

  async findBySubdomain(subdomain: string): Promise<Tenant> {
    const tenant = await this.tenantModel.findOne({ subdomain }).exec();
    if (!tenant) {
      throw new NotFoundException(`Subdomain: ${subdomain} olan işletme bulunamadı`);
    }
    return tenant;
  }

  async update(id: string, updateTenantDto: Partial<Tenant>): Promise<Tenant> {
    const updatedTenant = await this.tenantModel
      .findByIdAndUpdate(id, updateTenantDto, { new: true })
      .exec();
    if (!updatedTenant) {
      throw new NotFoundException(`ID: ${id} olan işletme bulunamadı`);
    }
    return updatedTenant;
  }

  async remove(id: string): Promise<Tenant> {
    const deletedTenant = await this.tenantModel.findByIdAndDelete(id).exec();
    if (!deletedTenant) {
      throw new NotFoundException(`ID: ${id} olan işletme bulunamadı`);
    }
    return deletedTenant;
  }
}
