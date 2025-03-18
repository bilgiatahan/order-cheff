import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Menu, MenuItem, MenuItemDocument } from '../../schemas/menu.schema';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(Menu.name) private menuModel: Model<Menu>,
    @InjectModel(MenuItem.name) private menuItemModel: Model<MenuItemDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(tenantId: string, createMenuDto: Partial<Menu>): Promise<Menu> {
    const menu = new this.menuModel({
      ...createMenuDto,
      tenantId: new Types.ObjectId(tenantId),
    });
    const savedMenu = await menu.save();
    await this.cacheManager.del(`menu_list_${tenantId}`);
    return savedMenu;
  }

  async findAllByTenant(tenantId: string): Promise<Menu[]> {
    const cacheKey = `menu_list_${tenantId}`;
    const cachedMenus = await this.cacheManager.get<Menu[]>(cacheKey);

    if (cachedMenus) {
      return cachedMenus;
    }

    const menus = await this.menuModel
      .find({ tenantId: new Types.ObjectId(tenantId) })
      .populate('categories')
      .exec();

    await this.cacheManager.set(cacheKey, menus);
    return menus;
  }

  async findOne(tenantId: string, id: string): Promise<Menu> {
    const cacheKey = `menu_${tenantId}_${id}`;
    const cachedMenu = await this.cacheManager.get<Menu>(cacheKey);

    if (cachedMenu) {
      return cachedMenu;
    }

    const menu = await this.menuModel
      .findOne({
        _id: new Types.ObjectId(id),
        tenantId: new Types.ObjectId(tenantId),
      })
      .populate('categories')
      .exec();

    if (!menu) {
      throw new NotFoundException(`ID: ${id} olan menü bulunamadı`);
    }

    await this.cacheManager.set(cacheKey, menu);
    return menu;
  }

  async update(tenantId: string, id: string, updateMenuDto: Partial<Menu>): Promise<Menu> {
    const menu = await this.menuModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
          tenantId: new Types.ObjectId(tenantId),
        },
        updateMenuDto,
        { new: true },
      )
      .populate('categories')
      .exec();

    if (!menu) {
      throw new NotFoundException(`ID: ${id} olan menü bulunamadı`);
    }

    // Cache'i güncelle
    const cacheKey = `menu_${tenantId}_${id}`;
    await this.cacheManager.set(cacheKey, menu);
    await this.cacheManager.del(`menu_list_${tenantId}`);

    return menu;
  }

  async remove(tenantId: string, id: string): Promise<Menu> {
    const menu = await this.menuModel
      .findOneAndDelete({
        _id: new Types.ObjectId(id),
        tenantId: new Types.ObjectId(tenantId),
      })
      .exec();

    if (!menu) {
      throw new NotFoundException(`ID: ${id} olan menü bulunamadı`);
    }

    // Cache'i temizle
    const cacheKey = `menu_${tenantId}_${id}`;
    await this.cacheManager.del(cacheKey);
    await this.cacheManager.del(`menu_list_${tenantId}`);

    return menu;
  }

  async addCategory(tenantId: string, menuId: string, categoryId: string): Promise<Menu> {
    const menu = await this.menuModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(menuId),
          tenantId: new Types.ObjectId(tenantId),
        },
        { $addToSet: { categories: new Types.ObjectId(categoryId) } },
        { new: true },
      )
      .populate('categories')
      .exec();

    if (!menu) {
      throw new NotFoundException(`ID: ${menuId} olan menü bulunamadı`);
    }

    // Cache'i güncelle
    const cacheKey = `menu_${tenantId}_${menuId}`;
    await this.cacheManager.set(cacheKey, menu);
    await this.cacheManager.del(`menu_list_${tenantId}`);

    return menu;
  }

  async removeCategory(tenantId: string, menuId: string, categoryId: string): Promise<Menu> {
    const menu = await this.menuModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(menuId),
          tenantId: new Types.ObjectId(tenantId),
        },
        { $pull: { categories: new Types.ObjectId(categoryId) } },
        { new: true },
      )
      .populate('categories')
      .exec();

    if (!menu) {
      throw new NotFoundException(`ID: ${menuId} olan menü bulunamadı`);
    }

    // Cache'i güncelle
    const cacheKey = `menu_${tenantId}_${menuId}`;
    await this.cacheManager.set(cacheKey, menu);
    await this.cacheManager.del(`menu_list_${tenantId}`);

    return menu;
  }

  async createMany(
    items: Pick<MenuItem, 'name' | 'price' | 'category'>[],
  ): Promise<MenuItemDocument[]> {
    return this.menuItemModel.insertMany(items as MenuItem[]);
  }

  async findAll(): Promise<MenuItemDocument[]> {
    return this.menuItemModel.find().exec();
  }

  async findByCategory(category: string): Promise<MenuItemDocument[]> {
    return this.menuItemModel.find({ category }).exec();
  }

  // Örnek mock data oluşturma fonksiyonu
  async createMockData(): Promise<void> {
    try {
      console.log('Mock data oluşturma başlıyor...');
      console.log('MongoDB bağlantısı kontrol ediliyor...');

      // MongoDB bağlantısını kontrol et
      try {
        await this.menuItemModel.findOne().exec();
        console.log('MongoDB bağlantısı başarılı');
      } catch (dbError) {
        console.error('MongoDB bağlantı hatası:', dbError);
        throw new Error('Veritabanı bağlantısı kurulamadı');
      }

      const mockMenuItems = [
        {
          name: 'Klasik Hamburger',
          price: 120,
          description: 'Dana eti, marul, domates, turşu ve özel sos ile',
          category: 'Burgerler',
          preparationTime: 15,
          ingredients: ['Dana eti', 'Marul', 'Domates', 'Turşu', 'Özel sos'],
          imageUrl: 'https://varolgurme.com/menumen/image/catalog/icons/Burger/Burger-Klasik.jpg',
          isAvailable: true,
        },
        {
          name: 'Margherita Pizza',
          price: 140,
          description: 'Domates sosu, mozarella peyniri ve fesleğen ile',
          category: 'Pizzalar',
          preparationTime: 20,
          ingredients: ['Domates sosu', 'Mozarella', 'Fesleğen'],
          imageUrl:
            'https://safrescobaldistatic.blob.core.windows.net/media/2022/11/PIZZA-MARGHERITA.jpg',
          isAvailable: true,
        },
        {
          name: 'Sezar Salata',
          price: 85,
          description: 'Taze marul, kruton, parmesan peyniri ve sezar sos',
          category: 'Salatalar',
          preparationTime: 10,
          ingredients: ['Marul', 'Kruton', 'Parmesan', 'Sezar sos'],
          imageUrl:
            'http://m.ftscrt.com/static/recipe/0586642a-43c4-4f5c-b129-b757ddfb7707_fs2.jpg',
          isAvailable: true,
        },
        {
          name: 'Türk Kahvesi',
          price: 30,
          description: 'Geleneksel Türk kahvesi',
          category: 'İçecekler',
          preparationTime: 5,
          ingredients: ['Türk kahvesi'],
          imageUrl:
            'https://www.kulturportali.gov.tr/repoKulturPortali/small/PetekIcon/turkkahve_20180124152304783.jpg',
          isAvailable: true,
        },
        {
          name: 'Künefe',
          price: 75,
          description: 'Antep fıstığı ile servis edilen geleneksel künefe tatlısı',
          category: 'Tatlılar',
          preparationTime: 15,
          ingredients: ['Kadayıf', 'Peynir', 'Antep fıstığı', 'Şerbet'],
          imageUrl:
            'https://assets.tmecosys.com/image/upload/t_web767x639/img/recipe/ras/Assets/04ec6dd767bbb83a5b97f7c994a72239/Derivates/009a0e4c88ac4a1fcffe05de641b72edaef56637.jpg',
          isAvailable: true,
        },
      ];

      console.log('Mock veriler silinmeye başlanıyor...');
      try {
        const deleteResult = await this.menuItemModel.deleteMany({});
        console.log(
          'Mevcut veriler başarıyla silindi. Silinen kayıt sayısı:',
          deleteResult.deletedCount,
        );
      } catch (deleteError: unknown) {
        console.error('Verileri silerken hata:', deleteError);
        if (deleteError instanceof Error) {
          throw new Error(`Verileri silerken hata oluştu: ${deleteError.message}`);
        }
        throw new Error('Verileri silerken bilinmeyen bir hata oluştu');
      }

      console.log('Yeni mock veriler ekleniyor...');
      try {
        console.log('Eklenecek veri sayısı:', mockMenuItems.length);
        const createdItems = await this.menuItemModel.insertMany(mockMenuItems, { ordered: false });
        console.log('Mock veriler başarıyla eklendi:', createdItems.length, 'adet ürün');
        console.log(
          "Eklenen ürünlerin ID'leri:",
          createdItems.map((item) => item._id),
        );
      } catch (insertError: unknown) {
        console.error('Veri eklerken hata:', insertError);
        if (insertError instanceof Error) {
          throw new Error(`Veri eklerken hata oluştu: ${insertError.message}`);
        }
        throw new Error('Veri eklerken bilinmeyen bir hata oluştu');
      }
    } catch (error: unknown) {
      console.error('Mock veri işlemi sırasında hata:', error);
      if (error instanceof Error) {
        throw new Error(`Mock veri oluşturma hatası: ${error.message}`);
      }
      throw new Error('Mock veri oluşturma sırasında bilinmeyen bir hata oluştu');
    }
  }
}
