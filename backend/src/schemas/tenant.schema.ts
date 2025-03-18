import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TenantDocument = Tenant & Document;

@Schema({ timestamps: true })
export class Tenant {
  @Prop({ required: true, unique: true })
  subdomain: string;

  @Prop({ required: true })
  businessName: string;

  @Prop()
  description: string;

  @Prop()
  logo: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  address: string;

  @Prop({ type: Object })
  settings: {
    theme: string;
    currency: string;
    language: string;
  };
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);
