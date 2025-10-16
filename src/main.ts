import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   app.enableCors();

//   await app.listen(process.env.PORT ?? 3000);

   
// }
// bootstrap();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure CORS to allow your future frontend URL
  const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
  app.enableCors({
    origin: [frontendURL],
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
