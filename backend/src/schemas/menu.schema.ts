import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MenuDocument = Menu & Document;

@Schema({ timestamps: true })
export class Menu {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop([{ type: Types.ObjectId, ref: 'Category' }])
  categories: Types.ObjectId[];
}

export const MenuSchema = SchemaFactory.createForClass(Menu);

@Schema({ timestamps: true })
export class MenuItem {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: false })
  tenantId?: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ default: true })
  isAvailable: boolean;

  @Prop({ default: 0 })
  preparationTime: number; // dakika cinsinden

  @Prop()
  imageUrl: string;

  @Prop({ type: [String], default: [] })
  ingredients: string[];
}

export type MenuItemDocument = MenuItem & Document;
export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);
