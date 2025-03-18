import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { TenantRequest } from '../interfaces/tenant-request.interface';

export const Tenant = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<TenantRequest>();
  if (!request.tenant) {
    throw new UnauthorizedException('Tenant bilgisi bulunamadı');
  }
  return request.tenant;
});
