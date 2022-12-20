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
    { createReadStream, filename }: FileUpload,
  ) {

    console.log(createReadStream, filename);
    const file = await this.fileService.uploadFile(
      createReadStream(),
      filename,
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
