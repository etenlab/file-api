import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FileService } from './file.service';
import { File } from './entities/file.entity';
import { CreateFileInput } from './dto/create-file.input';
import { UpdateFileInput } from './dto/update-file.input';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { createWriteStream } from 'fs';

@Resolver(() => File)
export class FileResolver {
  constructor(private readonly fileService: FileService) {}

  @Mutation(() => Boolean)
  async uploadFile(
    @Args({ name: 'file', type: () => GraphQLUpload })
    { createReadStream, filename }: FileUpload,
  ) {
    console.log(filename);
    return new Promise(async (resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(`./upload/${filename}`))
        .on('finish', () => resolve(true))
        .on('error', () => reject(false)),
    );
  }

  @Mutation(() => File)
  createFile(@Args('createFileInput') createFileInput: CreateFileInput) {
    return this.fileService.create(createFileInput);
  }

  @Query(() => [File], { name: 'file' })
  findAll() {
    return this.fileService.findAll();
  }

  @Query(() => File, { name: 'file' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.fileService.findOne(id);
  }

  @Mutation(() => File)
  updateFile(@Args('updateFileInput') updateFileInput: UpdateFileInput) {
    return this.fileService.update(updateFileInput.id, updateFileInput);
  }

  @Mutation(() => File)
  removeFile(@Args('id', { type: () => Int }) id: number) {
    return this.fileService.remove(id);
  }
}
