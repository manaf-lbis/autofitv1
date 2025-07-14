export interface IAssetsService {
  getAsset(params: {
    publicId: string;
    resourceType: 'image' | 'raw';
  }): Promise<string>;
}