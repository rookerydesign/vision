
import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getImages, ImageMetadata } from "@/lib/api";
import ImageCard from "./ImageCard";

interface ImageGridProps {
  selectedTags: string[];
  showFavorites: boolean;
  onImageClick: (id: string) => void;
  thumbnailSize: "small" | "medium" | "large";
}

const ImageGrid = ({ 
  selectedTags, 
  showFavorites, 
  onImageClick,
  thumbnailSize 
}: ImageGridProps) => {
  const gridRef = useRef<HTMLDivElement>(null);
  
  const { data: images, isLoading, error } = useQuery({
    queryKey: ["images", selectedTags],
    queryFn: () => getImages(selectedTags),
    staleTime: 30000, // 30 seconds
  });

  // Filter images by favorites if needed
  const filteredImages = showFavorites 
    ? images?.filter(img => img.favorite === 1) 
    : images;

  // Adjust layout after images load
  useEffect(() => {
    if (!filteredImages || !gridRef.current) return;
    
    // Allow images to load
    const timer = setTimeout(() => {
      const imageElements = Array.from(gridRef.current?.querySelectorAll("img") || []);
      
      imageElements.forEach((img) => {
        if (img.complete) {
          const card = img.closest(".masonry-item");
          if (card) {
            const aspectRatio = img.naturalHeight / img.naturalWidth;
            const rowSpan = Math.ceil(aspectRatio * 30); // Adjust based on row height
            card.style.setProperty("--row-span", rowSpan.toString());
          }
        }
      });
    }, 300);
    
    return () => clearTimeout(timer);
  }, [filteredImages, thumbnailSize]);

  if (isLoading) {
    return (
      <div className="masonry-grid animate-pulse">
        {Array.from({ length: 12 }).map((_, i) => (
          <div 
            key={i}
            className="bg-muted/20 rounded-md h-64 masonry-item"
            style={{ "--row-span": 30 } as React.CSSProperties}
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h3 className="text-xl font-medium mb-2">Error Loading Images</h3>
        <p className="text-muted-foreground">
          There was a problem loading the images. Please try again.
        </p>
      </div>
    );
  }

  if (!filteredImages || filteredImages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h3 className="text-xl font-medium mb-2">No Images Found</h3>
        <p className="text-muted-foreground">
          {selectedTags.length > 0
            ? `No images match the selected tags: ${selectedTags.join(", ")}`
            : showFavorites
            ? "You don't have any favorite images yet."
            : "Your image collection is empty."}
        </p>
      </div>
    );
  }

  return (
    <div ref={gridRef} className="masonry-grid">
      {filteredImages.map((image: ImageMetadata) => (
        <ImageCard
          key={image.id}
          image={image}
          onClick={() => onImageClick(image.id)}
          thumbnailSize={thumbnailSize}
        />
      ))}
    </div>
  );
};

export default ImageGrid;
