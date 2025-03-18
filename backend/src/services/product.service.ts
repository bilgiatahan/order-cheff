import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

  async create(createProductDto: Partial<Product>): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async findAll(tenantId: string): Promise<Product[]> {
    return this.productModel.find({ tenantId, isActive: true }).exec();
  }

  async findOne(id: string): Promise<Product | null> {
    return this.productModel.findById(id).exec();
  }

  async findByCategory(tenantId: string, categoryId: string): Promise<Product[]> {
    // categoryId direkt olarak ürünün categoryId alanı ile eşleştirilir
    return this.productModel.find({ tenantId, categoryId, isActive: true }).exec();
  }

  async update(id: string, updateProductDto: Partial<Product>): Promise<Product | null> {
    return this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Product | null> {
    return this.productModel.findByIdAndDelete(id).exec();
  }

  async search(tenantId: string, searchTerm: string): Promise<Product[]> {
    return this.productModel
      .find({
        tenantId,
        isActive: true,
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { tags: { $in: [new RegExp(searchTerm, 'i')] } },
        ],
      })
      .exec();
  }
}
