import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
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
    console.log('akak');
    const file = await this.fileService.uploadFile(
      createReadStream(),
      filename,
    );
    return file;
  }

  @Query(() => [File], { name: 'file' })
  findAll() {
    return this.fileService.findAll();
  }

  // @Query(() => File, { name: 'file' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.fileService.findOne(id);
  // }
}
