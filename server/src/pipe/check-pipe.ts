import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class CheckFileSizePipe implements PipeTransform {
  constructor(private readonly maxSizeMb: number) {}

  transform(
    value: Express.Multer.File | Express.Multer.File[],
    metadata: ArgumentMetadata,
  ) {
    const maxSizeBytes = this.maxSizeMb * 1024 * 1024;
    const files = Array.isArray(value) ? value : [value];

    for (const file of files) {
        console.log(file)
      if (file.size > maxSizeBytes) {
        throw new BadRequestException(
          `Fayl "${file.originalname}" hajmi ${this.maxSizeMb}MB dan oshmasligi kerak`,
        );
      }
    }

    return value;
  }
}
