import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import { ConfigService } from '@nestjs/config'

import { v2 as cloudinary } from 'cloudinary'

@Injectable()
export class CloudinaryService {
  constructor(
    private readonly configService: ConfigService,
  ) {
    cloudinary.config({
      cloud_name:
        this.configService.get<string>(
          'CLOUDINARY_CLOUD_NAME',
        ),

      api_key:
        this.configService.get<string>(
          'CLOUDINARY_API_KEY',
        ),

      api_secret:
        this.configService.get<string>(
          'CLOUDINARY_API_SECRET',
        ),
    })
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ) {
    try {
      const result = await new Promise<any>(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder,
              },
              (error, result) => {
                if (error) {
                  return reject(error)
                }

                resolve(result)
              },
            )
            .end(file.buffer)
        },
      )

      return {
        url: result.secure_url,
        publicId: result.public_id,
      }
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to upload image',
      )
    }
  }

  async deleteFile(
    publicId: string,
  ) {
    try {
      return await cloudinary.uploader.destroy(
        publicId,
      )
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete image',
      )
    }
  }
}