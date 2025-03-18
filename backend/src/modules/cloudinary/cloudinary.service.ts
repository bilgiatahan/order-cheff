import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: Express.Multer.File, folder: string = 'order-cheff'): Promise<string> {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder,
        transformation: [
          { width: 800, height: 800, crop: 'limit' },
          { fetch_format: 'auto', quality: 'auto' },
        ],
      });
      return result.secure_url;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(`Görsel yüklenirken hata oluştu: ${error.message}`);
    }
  }

  async deleteImage(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(`Görsel silinirken hata oluştu: ${error.message}`);
    }
  }

  getPublicIdFromUrl(url: string): string {
    const splitUrl = url.split('/');
    const filename = splitUrl[splitUrl.length - 1];
    return `${splitUrl[splitUrl.length - 2]}/${filename.split('.')[0]}`;
  }
}
