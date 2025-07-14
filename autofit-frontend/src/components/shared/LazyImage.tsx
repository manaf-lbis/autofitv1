import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAssetURL } from "@/utils/utilityFunctions.ts/getAssetURL";

interface LazyImageProps {
  publicId: string;
  resourceType: "image" | "raw";
  alt?: string;
  className?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({
  publicId,
  resourceType,
  alt = "Image",
  className,
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn("relative w-full", className)}>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Loader2 className="h-6 w-6 text-gray-500 animate-spin" />
        </div>
      )}
      <img
        src={getAssetURL(publicId, resourceType)}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={cn(
          "w-full h-auto object-contain max-h-96 transition-opacity",
          loaded ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
};

export default LazyImage;
