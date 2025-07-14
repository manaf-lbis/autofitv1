import { NextFunction, Request, Response } from "express";
import { AssetsService } from "../../services/assets/assetsService";
import { ApiError } from "../../utils/apiError";

export class AssetsController {
  constructor(private _assetService: AssetsService) {}

  async getAsset(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { publicId, resourceType } = req.query;

      if (!publicId || !resourceType) {
        throw new ApiError("Missing publicId or resourceType", 400);
      }
      if (resourceType !== "image" && resourceType !== "raw") {
        throw new ApiError("Invalid resourceType", 400);
      }

      const signedUrl = await this._assetService.getAsset({ publicId: publicId as string, resourceType: resourceType as "image" | "raw" });
      const response = await fetch(signedUrl);

      if (!response.ok) {
        throw new ApiError(`Failed to fetch asset: ${response.statusText}`, response.status);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType) {
        throw new ApiError("Missing content type", 500);
      }

      res.setHeader("Content-Type", contentType);
      res.setHeader("Cache-Control", "public, max-age=3600");

      const arrayBuffer = await response.arrayBuffer();
      res.send(Buffer.from(arrayBuffer));


    } catch (error) {
      next(error);
    
    }
  }
}

