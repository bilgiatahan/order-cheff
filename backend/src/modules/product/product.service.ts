import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from '../../schemas/product.schema';
import { Category, CategoryDocument } from '../../schemas/category.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(
    tenantId: string,
    createProductDto: Partial<Product>,
    image?: Express.Multer.File,
  ): Promise<Product> {
    let imageUrl: string | undefined;

    if (image) {
      imageUrl = await this.cloudinaryService.uploadImage(image, `${tenantId}/products`);
    }

    const product = new this.productModel({
      ...createProductDto,
      tenantId: new Types.ObjectId(tenantId),
      image: imageUrl,
    });

    return product.save();
  }

  async findAllByTenant(tenantId: string): Promise<Product[]> {
    return this.productModel
      .find({ tenantId: new Types.ObjectId(tenantId) })
      .populate('categoryId')
      .exec();
  }

  async findAllByCategory(tenantId: string, categoryId: string): Promise<Product[]> {
    return this.productModel
      .find({
        tenantId: new Types.ObjectId(tenantId),
        categoryId: new Types.ObjectId(categoryId),
      })
      .exec();
  }

  async findAllByCategoryName(tenantId: string, categoryName: string): Promise<Product[]> {
    try {
      // Doğrudan inject edilmiş model ile kategoriyi bul
      const category = await this.categoryModel.findOne({
        tenantId: new Types.ObjectId(tenantId),
        name: categoryName,
      });

      if (!category) {
        console.log(`"${categoryName}" adında kategori bulunamadı.`);
        return [];
      }

      console.log(`"${categoryName}" kategorisi bulundu: ${category._id}`);

      // Bulunan kategori ID'siyle ürünleri getir
      return this.productModel
        .find({
          tenantId: new Types.ObjectId(tenantId),
          categoryId: category._id,
        })
        .exec();
    } catch (error) {
      console.error(`Kategori adına göre ürün arama hatası:`, error);
      return [];
    }
  }

  async findOne(tenantId: string, id: string): Promise<Product> {
    const product = await this.productModel
      .findOne({
        _id: new Types.ObjectId(id),
        tenantId: new Types.ObjectId(tenantId),
      })
      .populate('categoryId')
      .exec();

    if (!product) {
      throw new NotFoundException(`ID: ${id} olan ürün bulunamadı`);
    }
    return product;
  }

  async update(
    tenantId: string,
    id: string,
    updateProductDto: Partial<Product>,
    image?: Express.Multer.File,
  ): Promise<Product> {
    const product = await this.productModel.findOne({
      _id: new Types.ObjectId(id),
      tenantId: new Types.ObjectId(tenantId),
    });

    if (!product) {
      throw new NotFoundException(`ID: ${id} olan ürün bulunamadı`);
    }

    if (image) {
      if (product.image) {
        const publicId = this.cloudinaryService.getPublicIdFromUrl(product.image);
        await this.cloudinaryService.deleteImage(publicId);
      }

      const imageUrl = await this.cloudinaryService.uploadImage(image, `${tenantId}/products`);
      updateProductDto.image = imageUrl;
    }

    const updatedProduct = await this.productModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
          tenantId: new Types.ObjectId(tenantId),
        },
        updateProductDto,
        { new: true },
      )
      .populate('categoryId')
      .exec();

    if (!updatedProduct) {
      throw new NotFoundException(`ID: ${id} olan ürün güncellenirken hata oluştu`);
    }

    return updatedProduct;
  }

  async remove(tenantId: string, id: string): Promise<Product> {
    const product = await this.productModel
      .findOneAndDelete({
        _id: new Types.ObjectId(id),
        tenantId: new Types.ObjectId(tenantId),
      })
      .exec();

    if (!product) {
      throw new NotFoundException(`ID: ${id} olan ürün bulunamadı`);
    }

    if (product.image) {
      const publicId = this.cloudinaryService.getPublicIdFromUrl(product.image);
      await this.cloudinaryService.deleteImage(publicId);
    }

    return product;
  }
}
