import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: ['*', 'http://localhost:5173'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      credentials: true,
      optionsSuccessStatus: 204,
    },
  });
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
