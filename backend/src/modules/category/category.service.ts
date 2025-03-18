import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category, CategoryDocument } from '../../schemas/category.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(
    tenantId: string,
    createCategoryDto: Partial<Category>,
    image?: Express.Multer.File,
  ): Promise<Category> {
    let imageUrl: string | undefined;

    if (image) {
      imageUrl = await this.cloudinaryService.uploadImage(image, `${tenantId}/categories`);
    }

    const category = new this.categoryModel({
      ...createCategoryDto,
      tenantId: new Types.ObjectId(tenantId),
      image: imageUrl,
    });

    return category.save();
  }

  async findAllByTenant(tenantId: string): Promise<Category[]> {
    return this.categoryModel
      .find({ tenantId: new Types.ObjectId(tenantId) })
      .sort({ order: 1 })
      .exec();
  }

  async findOne(tenantId: string, id: string): Promise<Category> {
    const category = await this.categoryModel
      .findOne({
        _id: new Types.ObjectId(id),
        tenantId: new Types.ObjectId(tenantId),
      })
      .exec();

    if (!category) {
      throw new NotFoundException(`ID: ${id} olan kategori bulunamadı`);
    }
    return category;
  }

  async update(
    tenantId: string,
    id: string,
    updateCategoryDto: Partial<Category>,
    image?: Express.Multer.File,
  ): Promise<Category> {
    const category = await this.categoryModel.findOne({
      _id: new Types.ObjectId(id),
      tenantId: new Types.ObjectId(tenantId),
    });

    if (!category) {
      throw new NotFoundException(`ID: ${id} olan kategori bulunamadı`);
    }

    if (image) {
      if (category.image) {
        const publicId = this.cloudinaryService.getPublicIdFromUrl(category.image);
        await this.cloudinaryService.deleteImage(publicId);
      }

      const imageUrl = await this.cloudinaryService.uploadImage(image, `${tenantId}/categories`);
      updateCategoryDto.image = imageUrl;
    }

    const updatedCategory = await this.categoryModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
          tenantId: new Types.ObjectId(tenantId),
        },
        updateCategoryDto,
        { new: true },
      )
      .exec();

    if (!updatedCategory) {
      throw new NotFoundException(`ID: ${id} olan kategori güncellenirken hata oluştu`);
    }

    return updatedCategory;
  }

  async remove(tenantId: string, id: string): Promise<Category> {
    const category = await this.categoryModel
      .findOneAndDelete({
        _id: new Types.ObjectId(id),
        tenantId: new Types.ObjectId(tenantId),
      })
      .exec();

    if (!category) {
      throw new NotFoundException(`ID: ${id} olan kategori bulunamadı`);
    }

    if (category.image) {
      const publicId = this.cloudinaryService.getPublicIdFromUrl(category.image);
      await this.cloudinaryService.deleteImage(publicId);
    }

    return category;
  }

  async updateOrder(tenantId: string, categories: { id: string; order: number }[]): Promise<void> {
    const updateOperations = categories.map(({ id, order }) => ({
      updateOne: {
        filter: { _id: new Types.ObjectId(id), tenantId: new Types.ObjectId(tenantId) },
        update: { $set: { order } },
      },
    }));

    await this.categoryModel.bulkWrite(updateOperations);
  }
}
