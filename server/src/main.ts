import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { HttpExceptionFilter } from './filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("/api")


  app.enableCors({
  origin: 'http://localhost:4000',
  credentials: true,
});


  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter())
  const config = new DocumentBuilder()
    .setTitle('RailAir API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  const PORT = process.env.APP_PORT ? Number(process.env.APP_PORT) : 4000
  await app.listen(PORT, () => {
    console.log(`Server is running ${PORT}`)
    console.log(`Swagger http://localhost:${PORT}/docs`)
  });
}
bootstrap();
