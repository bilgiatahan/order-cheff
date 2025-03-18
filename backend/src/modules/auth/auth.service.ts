import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Tenant } from '../../schemas/tenant.schema';
import { User } from '../../schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Tenant.name) private tenantModel: Model<Tenant>,
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: any) {
    const { email, password, businessName, subdomain } = registerDto;

    // Subdomain kontrolü
    const existingTenant = await this.tenantModel.findOne({ subdomain });
    if (existingTenant) {
      throw new ConflictException('Bu subdomain zaten kullanımda');
    }

    // Email kontrolü
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Bu email adresi zaten kayıtlı');
    }

    // Şifre hashleme
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tenant oluşturma
    const tenant = await this.tenantModel.create({
      businessName,
      subdomain,
      email,
      phone: '0000000000', // Varsayılan değer
      isActive: true,
    });

    // Admin kullanıcı oluşturma
    const user = await this.userModel.create({
      email,
      password: hashedPassword,
      role: 'admin',
      tenantId: tenant._id,
      name: businessName,
    });

    // JWT token oluşturma
    const token = this.jwtService.sign({
      userId: user._id,
      tenantId: tenant._id,
      role: user.role,
    });

    return { token };
  }

  async login(loginDto: any) {
    const { email, password } = loginDto;

    // Kullanıcı kontrolü
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    // Şifre kontrolü
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new NotFoundException('Geçersiz şifre');
    }

    // JWT token oluşturma
    const token = this.jwtService.sign({
      userId: user._id,
      tenantId: user.tenantId,
      role: user.role,
    });

    return { token };
  }

  async checkSubdomain(subdomain: string) {
    const tenant = await this.tenantModel.findOne({ subdomain });
    if (tenant) {
      throw new ConflictException('Bu subdomain zaten kullanımda');
    }
    return { available: true };
  }
}
