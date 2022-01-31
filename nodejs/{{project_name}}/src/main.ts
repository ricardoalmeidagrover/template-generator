import './utils/tracer';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = config.get('SERVICE_PORT');
  await app.listen(port || 3000);
  Logger.log(`🚀  Service running at http://localhost:${port}/graphql`);
}
bootstrap();