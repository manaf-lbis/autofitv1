// import cloudinary from '../config/cloudinary';
// import { ApiError } from './apiError';

// export const getSignedUrl = async (publicId: string, resourceType: 'image' | 'raw', expiresInSeconds: number = 3600): Promise<string> => {
//   if (!process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_API_KEY) {
//     throw new ApiError('Cloudinary configuration missing', 500);
//   }

//   if (!publicId.includes('/')) {
//     throw new ApiError('Invalid public_id: must include folder path', 400);
//   }

//   const signedUrl = cloudinary.utils.api_sign_request(
//     {
//       public_id: publicId,
//       timestamp: Math.floor(Date.now() / 1000),
//       expires_at: Math.floor(Date.now() / 1000) + expiresInSeconds,
//     },
//     process.env.CLOUDINARY_API_SECRET
//   );

//   return cloudinary.url(publicId, {
//     resource_type: resourceType,
//     secure: true,
//     sign_url: true,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     signature: signedUrl,
//     type: 'private',
//   });
// };




import cloudinary from '../config/cloudinary';
import { ApiError } from './apiError';

export const getSignedUrl = async (publicId: string, resourceType: 'image' | 'raw', expiresInSeconds: number = 60): Promise<string> => {
  if (!process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_CLOUD_NAME) {
    throw new ApiError('Cloudinary configuration missing', 500);
  }

  if (!publicId.includes('/')) {
    throw new ApiError('Invalid public_id: must include folder path', 400);
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const expiresAt = timestamp + expiresInSeconds;

  const params = { 
    public_id: publicId, 
    timestamp: timestamp, 
    expires_at: expiresAt 
  };

  const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET);
  console.log('Current Server Time (Unix):', timestamp);
  console.log('Signature Params:', params);
  console.log('Generated Signature:', signature);

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
  console.log('Generated URL with Unique Param:', `${url}&_t=${uniqueParam}`);
  return `${url}&_t=${uniqueParam}`;
};