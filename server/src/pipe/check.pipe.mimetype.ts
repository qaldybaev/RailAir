import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class CheckFileMimetypes implements PipeTransform {
  constructor(private readonly allowedTypes: string[]) {}

  transform(
    value: Express.Multer.File | Express.Multer.File[],
    metadata: ArgumentMetadata,
  ) {
    const files = Array.isArray(value) ? value : [value];

    for (const file of files) {
      const fileType = file.originalname.split('.').pop();
      console.log(fileType)
      if (!this.allowedTypes.includes(fileType || '')) {
        throw new BadRequestException(
          `Faqat ${this.allowedTypes.join(', ')} formatdagi fayllar qabul qilinadi`,
        );
      }
    }

    return value;
  }
}
