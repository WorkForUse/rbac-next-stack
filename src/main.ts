import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // Helmet for security (prod-level)
  if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
  }

  // CORS setup
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.use(cookieParser());

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Digital Pylot API RBAC SYSTEM')
    .setDescription('API for Digital Pylot app with PostgreSQL')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  console.log('Swagger docs available at http://localhost:3001/api');
  await app.listen(3001); // Backend port
}
bootstrap();