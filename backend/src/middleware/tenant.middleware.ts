import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Reflector } from '@nestjs/core';
import { TenantRequest } from '../interfaces/tenant-request.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tenant } from '../modules/tenant/schemas/tenant.schema';

interface RouteLayer {
  handle: {
    name: string;
  };
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(
    private reflector: Reflector,
    @InjectModel(Tenant.name) private tenantModel: Model<Tenant>,
  ) {}

  async use(req: TenantRequest, res: Response, next: NextFunction): Promise<void> {
    // Handler fonksiyonunu bul
    const handler = req.route?.stack?.find(
      (layer: RouteLayer) => layer.handle?.name === 'bound dispatch',
    );
    const controllerMethod = handler?.handle;

    if (!controllerMethod) {
      next();
      return;
    }

    // Public dekoratörünü kontrol et
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, controllerMethod);

    if (isPublic) {
      next();
      return;
    }

    // Tenant ID başlığını kontrol et
    const tenantHeader = req.headers['x-tenant-id'];

    // Subdomain bilgisini al (subdomain middleware'i tarafından eklendi)
    const subdomain = (req as any).subdomain;

    // Eğer subdomain varsa, bu subdomain'e göre tenant'ı bul
    if (subdomain) {
      try {
        const tenant = await this.tenantModel.findOne({ subdomain: subdomain, isActive: true });
        if (tenant) {
          req.tenant = {
            _id: tenant._id,
            subdomain: tenant.subdomain,
            businessName: tenant.businessName,
            email: tenant.email,
            phone: tenant.phone,
            isActive: tenant.isActive,
          };
          next();
          return;
        }
      } catch (error: unknown) {
        console.error(
          `Subdomain tenant arama hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`,
        );
      }
    }

    // Subdomain ile bulunamadıysa veya subdomain yoksa, x-tenant-id header'ına bak
    if (!tenantHeader) {
      throw new UnauthorizedException('Tenant bilgisi bulunamadı');
    }

    try {
      const tenant = await this.tenantModel.findById(tenantHeader.toString());
      if (!tenant || !tenant.isActive) {
        throw new UnauthorizedException('Geçersiz tenant bilgisi');
      }

      req.tenant = {
        _id: tenant._id,
        subdomain: tenant.subdomain,
        businessName: tenant.businessName,
        email: tenant.email,
        phone: tenant.phone,
        isActive: tenant.isActive,
      };
      next();
    } catch (error: unknown) {
      throw new UnauthorizedException('Geçersiz tenant bilgisi');
    }
  }
}
