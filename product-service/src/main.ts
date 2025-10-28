import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const grpcPort = configService.get<string>('URL_GRPC_SERVER') || '5051';
  logger.log('Starting gRPC microservice...');
  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      package: 'products',
      protoPath: join(__dirname, '../proto/products.proto'),
      loader: {
        includeDirs: [join(__dirname, '../proto')],
      },
      url: grpcPort,
    },
  });
  await app.startAllMicroservices();
  logger.log('gRPC microservice is listening on port 5051');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
