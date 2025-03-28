
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageMetadata, getThumbnailUrl } from "@/lib/api";
import { Star, LayoutGrid } from "lucide-react";

interface ImageCardProps {
  image: ImageMetadata;
  onClick: () => void;
  thumbnailSize: "small" | "medium" | "large";
}

const ImageCard = ({ image, onClick, thumbnailSize }: ImageCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Determine which thumbnail URL to use
  const thumbnailUrl = getThumbnailUrl(
    isHovered && thumbnailSize !== "large" 
      ? image.thumbnails.large 
      : image.thumbnails[thumbnailSize]
  );

  // Extract tags for display
  const tags = image.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

  // Calculate aspect ratio from image size for masonry layout
  const [width, height] = image.image_size.split("x").map(Number);
  const aspectRatio = height / width;
  const rowSpan = Math.ceil(aspectRatio * 30);

  return (
    <Card 
      className="overflow-hidden transition-shadow hover:shadow-lg cursor-pointer masonry-item"
      style={{ "--row-span": rowSpan } as React.CSSProperties}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        )}
        <img
          src={thumbnailUrl}
          alt={image.prompt.substring(0, 50)}
          className={`w-full object-cover transition-opacity duration-200 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
        />
        {image.favorite === 1 && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-yellow-500 hover:bg-yellow-600">
              <Star className="h-3 w-3 fill-white mr-1" /> Favorite
            </Badge>
          </div>
        )}
      </div>
      
      <CardFooter className="flex flex-col items-start p-3 space-y-2">
        <div className="flex items-center text-xs text-muted-foreground w-full justify-between">
          <span className="flex items-center">
            <LayoutGrid className="h-3 w-3 mr-1" /> {image.image_size}
          </span>
          <span>{new Date(image.created_at).toLocaleDateString()}</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-1">
          {tags.length > 0 ? (
            tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))
          ) : (
            <Badge variant="outline" className="text-xs bg-muted/50">
              No tags
            </Badge>
          )}
          {tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{tags.length - 3} more
            </Badge>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ImageCard;
