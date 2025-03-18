import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../schemas/category.schema';

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {}

  async create(createCategoryDto: Partial<Category>): Promise<Category> {
    const createdCategory = new this.categoryModel(createCategoryDto);
    return createdCategory.save();
  }

  async findAll(tenantId: string): Promise<Category[]> {
    return this.categoryModel.find({ tenantId, isActive: true }).sort({ order: 1 }).exec();
  }

  async findOne(id: string): Promise<Category | null> {
    return this.categoryModel.findById(id).exec();
  }

  async update(id: string, updateCategoryDto: Partial<Category>): Promise<Category | null> {
    return this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Category | null> {
    return this.categoryModel.findByIdAndDelete(id).exec();
  }

  async updateOrder(id: string, order: number): Promise<Category | null> {
    return this.categoryModel.findByIdAndUpdate(id, { order }, { new: true }).exec();
  }
}
