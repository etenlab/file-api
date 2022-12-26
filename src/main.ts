import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    graphqlUploadExpress({
      maxFileSize: process.env.MAX_FILE_SIZE || 1024 * 1024 * 50,
    }),
  );
  await app.listen(process.env.PORT);
}
bootstrap();
