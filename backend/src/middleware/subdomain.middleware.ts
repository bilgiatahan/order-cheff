import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SubdomainMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const host = req.headers.host || '';

    // 'ordercheff.com' ana domain'ini tanımla
    const mainDomain = process.env.NODE_ENV === 'production' ? 'ordercheff.com' : 'localhost:3000';

    // Subdomain'i çıkar
    let subdomain = null;
    if (host.includes(mainDomain) && host !== mainDomain) {
      // örn: 'mystore.ordercheff.com' -> 'mystore'
      subdomain = host.split('.')[0];
    }

    // Subdomain'i request nesnesine ekle
    (req as any).subdomain = subdomain;
    next();
  }
}
