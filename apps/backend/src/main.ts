// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS (se serve per il frontend)
  app.enableCors({ origin: true, credentials: true });

  // ✅ Validazione globale per tutti i DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // rimuove campi extra non dichiarati nel DTO
      forbidNonWhitelisted: true, // se arrivano campi non ammessi → 400
      transform: true,          // trasforma i tipi (string->number) quando possibile
    }),
  );

  // Swagger (se l'avevi già, lascia com'è)
  const config = new DocumentBuilder()
    .setTitle('Vini API')
    .setDescription('API del marketplace di vini')
    .setVersion('1.0.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Enter JWT token'
    })
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, doc, { swaggerOptions: { persistAuthorization: true } });

  // Health check endpoint for Render
  app.use('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const port = Number(process.env.PORT || 3000);
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 API running on http://localhost:${port} — Swagger: /api`);
}
bootstrap();