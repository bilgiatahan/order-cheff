import { Request } from 'express';
import { Types } from 'mongoose';

export interface TenantData {
  _id: Types.ObjectId;
  subdomain: string;
  businessName: string;
  description?: string;
  logo?: string;
  email: string;
  phone: string;
  isActive: boolean;
  address?: string;
  settings?: {
    theme: string;
    currency: string;
    language: string;
  };
}

export interface TenantRequest extends Request {
  tenant?: TenantData;
}
