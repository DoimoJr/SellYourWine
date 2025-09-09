import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CategoriesModule } from './categories/categories.module';
import { AddressesModule } from './addresses/addresses.module';
import { SellersModule } from './sellers/sellers.module';
import { InventoryModule } from './inventory/inventory.module';
import { ProductImagesModule } from './product-images/product-images.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
    CategoriesModule,
    AddressesModule,
    SellersModule,
    InventoryModule,
    ProductImagesModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}