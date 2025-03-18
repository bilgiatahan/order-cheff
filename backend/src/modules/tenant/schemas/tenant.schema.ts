import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TenantDocument = HydratedDocument<Tenant>;

@Schema({ timestamps: true })
export class Tenant {
  @Prop({ required: true, unique: true })
  subdomain: string;

  @Prop({ required: true })
  businessName: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  phone: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  logo?: string;

  @Prop()
  address?: string;

  @Prop()
  description?: string;

  @Prop()
  themeColor?: string;

  @Prop()
  websiteUrl?: string;

  @Prop()
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);
