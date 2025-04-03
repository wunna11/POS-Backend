import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {

  constructor() {
    cloudinary.config({
      cloud_name: 'dc8r3tskn',
      api_key: '263766899325519',
      api_secret: 'S0TH_3vbo7x0tpkSH9ETm8njtqY',
    });
  }

  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        if (result) {
          resolve(result);
        } else {
          reject(new Error('Upload result is undefined'));
        }
      });
      toStream(file.buffer).pipe(upload);
    });
  }
}