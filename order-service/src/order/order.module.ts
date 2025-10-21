import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'PRODUCT_PACKAGE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'products',
            protoPath: join(__dirname, '../../proto/products.proto'),
            loader: {
              includeDirs: [join(__dirname, '../proto')],
            },
            url: configService.get<string>('URL_GRPC_SERVER'),
          },
        }),
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
