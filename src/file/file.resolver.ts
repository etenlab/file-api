import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FileService } from './file.service';
import { File } from './file.model';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';

@Resolver(() => File)
export class FileResolver {
  constructor(private readonly fileService: FileService) {}

  @Mutation(() => File)
  async uploadFile(
    @Args({ name: 'file', type: () => GraphQLUpload })
    { createReadStream, filename: file_name }: FileUpload,
    @Args({ name: 'file_type', type: () => String }) file_type: string,
    @Args({ name: 'file_size', type: () => Int }) file_size: number,
  ) {
    const file = await this.fileService.uploadFile(
      createReadStream(),
      file_name,
      file_type,
      file_size,
    );
    return file;
  }

  @Query(() => [File], { name: 'fileList' })
  async getAll() {
    return await this.fileService.getAll();
  }

  @Query(() => File, { name: 'file' })
  async findOne(@Args({ name: 'id', type: () => Int }) id: number) {
    return await this.fileService.findOne(id);
  }
}
