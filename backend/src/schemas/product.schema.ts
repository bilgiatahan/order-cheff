import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  image: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Object })
  nutritionInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };

  @Prop([String])
  allergens: string[];

  @Prop({ default: 0 })
  preparationTime: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
