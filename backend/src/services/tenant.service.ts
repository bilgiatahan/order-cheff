import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tenant, TenantDocument } from '../schemas/tenant.schema';

@Injectable()
export class TenantService {
  constructor(@InjectModel(Tenant.name) private tenantModel: Model<TenantDocument>) {}

  async create(createTenantDto: Partial<Tenant>): Promise<Tenant> {
    const createdTenant = new this.tenantModel(createTenantDto);
    return createdTenant.save();
  }
  async findBySubdomain(subdomain: string): Promise<Tenant | null> {
    return this.tenantModel.findOne({ subdomain, isActive: true }).exec();
  }

  async findAll(): Promise<Tenant[]> {
    return this.tenantModel.find().exec();
  }

  async update(id: string, updateTenantDto: Partial<Tenant>): Promise<Tenant | null> {
    return this.tenantModel.findByIdAndUpdate(id, updateTenantDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Tenant | null> {
    return this.tenantModel.findByIdAndDelete(id).exec();
  }
}
