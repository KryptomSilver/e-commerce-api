import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  logger.log('Starting gRPC microservice...');
  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      package: 'products',
      protoPath: join(__dirname, '../../proto/products.proto'),
      loader:{
        includeDirs: [join(__dirname, '../../proto')],
      },
      url: 'localhost:5051',
    },
  });
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
  logger.log('gRPC microservice is listening on port 5051');
}
bootstrap();
