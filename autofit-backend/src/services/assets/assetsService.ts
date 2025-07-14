
// export class AssetsService {
//   async getAsset({ publicId, resourceType }: { publicId: string; resourceType: 'image' | 'raw' }) {
//     const timestamp = Math.floor(Date.now() / 1000);
//     const expiresAt = timestamp + 60;

//     const params = { public_id: publicId, timestamp: timestamp, expires_at: expiresAt };
//     const signature = (await import('../../config/cloudinary')).default.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET!);
//     const signedUrl = (await import('../../config/cloudinary')).default.url(publicId, {
//       resource_type: resourceType,
//       secure: true,
//       sign_url: true,
//       api_key: process.env.CLOUDINARY_API_KEY!,
//       signature: signature,
//       type: 'private',
//       private_cdn: false,
//     });

//     const response = await fetch(signedUrl);
//     if (!response.ok) {
//       throw new Error(`Failed to fetch asset: ${response.statusText}`);
//     }
//     return response;
//   }
// }


export class AssetsService {
  async getAsset({ publicId, resourceType }: { publicId: string; resourceType: 'image' | 'raw' }) {
    const timestamp = Math.floor(Date.now() / 1000);
    const expiresAt = timestamp + 3600;

    const params = { public_id: publicId, timestamp, expires_at: expiresAt };
    const signature = (await import('../../config/cloudinary')).default.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET!);
    return (await import('../../config/cloudinary')).default.url(publicId, {
      resource_type: resourceType,
      secure: true,
      sign_url: true,
      api_key: process.env.CLOUDINARY_API_KEY!,
      signature,
      type: 'private',
      private_cdn: false,
    });
  }
}