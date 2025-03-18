import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Reflector } from '@nestjs/core';
import { TenantRequest } from '../interfaces/tenant-request.interface';
import { Types } from 'mongoose';

interface RouteLayer {
  handle: {
    name: string;
  };
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private reflector: Reflector) {}

  use(req: TenantRequest, res: Response, next: NextFunction): void {
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

    const tenantHeader = req.headers['x-tenant-id'];
    if (!tenantHeader) {
      throw new UnauthorizedException('Tenant bilgisi bulunamadı');
    }

    req.tenant = {
      _id: new Types.ObjectId(tenantHeader.toString()),
      subdomain: '',
      businessName: '',
      email: '',
      phone: '',
      isActive: true,
    };
    next();
  }
}
