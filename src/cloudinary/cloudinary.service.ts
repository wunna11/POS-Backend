import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {

  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    folderPath?: string
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadOptions: any = {};

      if (folderPath) {
        uploadOptions.folder = folderPath;
      }

      const upload = v2.uploader.upload_stream(uploadOptions, (error, result) => {
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

  extractPublicIdFromUrl(url: string): string {
    // Example URL: https://res.cloudinary.com/demo/image/upload/v1234567890/folder/image.jpg
    const matches = url.match(/upload\/(?:v\d+\/)?(.+?)\.\w+$/);

    if (!matches || matches.length < 2) {
      throw new Error('Invalid Cloudinary URL format');
    }

    return matches[1]; // Returns 'folder/image'
  }

  async deleteImage(
    publicId: string,
    options?: { resource_type?: 'image' | 'video' | 'raw'; invalidate?: boolean }
  ): Promise<any> {
    try {
      const result = await v2.uploader.destroy(publicId, options);
      return result;
    } catch (error) {
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  }

  async deleteImageByUrl(
    url: string,
    options?: { resource_type?: 'image' | 'video' | 'raw'; invalidate?: boolean }
  ): Promise<any> {
    try {
      const publicId = this.extractPublicIdFromUrl(url);
      return await this.deleteImage(publicId, options);
    } catch (error) {
      throw new Error(`Failed to delete image by URL: ${error.message}`);
    }
  }
}