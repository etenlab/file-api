import { Injectable } from '@nestjs/common';
import { File } from './file.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { v4 as uuid } from 'uuid';
import { ReadStream } from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {}

  async uploadFile(readStream: ReadStream, filename: string): Promise<File> {
    try {
      const s3Client = new S3Client({
        region: process.env.AWS_S3_REGION,
        credentials: {
          accessKeyId: process.env.AWS_S3_ACCESS_ID,
          secretAccessKey: process.env.AWS_S3_SECRET_KEY,
        },
      });

      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `${uuid()}-${filename}`,
        Body: readStream,
      };

      const parallelUploads3 = new Upload({
        client: s3Client,
        params: uploadParams,
        queueSize: 4,
        partSize: 1024 * 1024 * 5,
        leavePartsOnError: false,
      });

      const s3Result = await parallelUploads3.done();
      const file = this.fileRepository.create({
        filename,
        url: s3Result['Location'],
      });
      return await this.fileRepository.save(file);
    } catch (err) {
      console.log('File upload failed', err);
    }
  }

  findAll() {
    return `This action returns all file`;
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }
}
