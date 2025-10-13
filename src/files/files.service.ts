import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

@Injectable()
export class FilesService {
  private uploadPath = join(__dirname, '../../uploads');

  constructor() {
    if (!existsSync(this.uploadPath)) {
      mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  getFilePath(filename: string) {
    return join(this.uploadPath, filename);
  }

  saveFile(file: Express.Multer.File) {
    return file.filename;
  }
}
