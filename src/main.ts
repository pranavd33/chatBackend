// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import * as dotenv from 'dotenv';
// dotenv.config();

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   app.enableCors();

//   await app.listen(process.env.PORT ?? 3000);

   
// }
// bootstrap();




import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = [
    process.env.FRONTEND_URL || 'https://chatfrontend-plgu.onrender.com',
    'http://localhost:3000',
    'http://127.0.0.1:5500',
  ];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000);
  console.log(`✅ Server running on port ${process.env.PORT || 3000}`);
  console.log(`✅ Allowed origins:`, allowedOrigins);
}
bootstrap();
