import cloudinary from '../config/cloudinary';
import { HttpStatus } from '../types/responseCode';
import { ApiError } from './apiError';

export const getSignedUrl = async (publicId: string, resourceType: 'image' | 'raw', expiresInSeconds: number = 60): Promise<string> => {
  if (!process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_CLOUD_NAME) {
    throw new ApiError('Cloudinary configuration missing', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  if (!publicId.includes('/')) {
    throw new ApiError('Invalid public_id: must include folder path', HttpStatus.BAD_REQUEST);
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const expiresAt = timestamp + expiresInSeconds;

  const params = { 
    public_id: publicId, 
    timestamp: timestamp, 
    expires_at: expiresAt 
  };

  const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET);

  const uniqueParam = Date.now();
  const url = cloudinary.url(publicId, {
    resource_type: resourceType,
    secure: true,
    sign_url: true,
    api_key: process.env.CLOUDINARY_API_KEY,
    signature: signature,
    type: 'private',
    private_cdn: false,
    queryParams: { _t: uniqueParam },
  });
  return `${url}&_t=${uniqueParam}`;
};