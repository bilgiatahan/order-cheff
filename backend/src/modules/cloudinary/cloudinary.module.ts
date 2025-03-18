import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryService } from '@modules/cloudinary/cloudinary.service';
import cloudinaryConfig from '../../config/cloudinary.config';
import { CloudinaryProvider } from '@modules/cloudinary/cloudinary.provider';

@Module({
  imports: [ConfigModule.forFeature(cloudinaryConfig)],
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}
