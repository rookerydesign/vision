
import { toast } from "@/hooks/use-toast";

const API_BASE_URL = "http://localhost:8000";

export interface ImageMetadata {
  id: string;
  filename: string;
  created_at: string;
  prompt: string;
  loras?: string;
  gen_settings?: string;
  image_size: string;
  tags: string;
  favorite: number;
  compressed: number;
  hash: string;
  thumbnails: {
    small: string;
    medium: string;
    large: string;
  };
}

export interface TagsMap {
  [key: string]: number;
}

export interface StatsData {
  total_images: number;
  tagged_images: number;
  untagged_images: number;
  top_tags: [string, number][];
}

// GET /api/images
export async function getImages(tags?: string[]): Promise<ImageMetadata[]> {
  try {
    const url = new URL(`${API_BASE_URL}/api/images`);
    if (tags && tags.length > 0) {
      url.searchParams.append("tags", tags.join(","));
    }
    
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch images:", error);
    toast({
      title: "Error",
      description: "Failed to load images. Please try again.",
      variant: "destructive",
    });
    return [];
  }
}

// GET /api/image/{id}
export async function getImageById(id: string): Promise<ImageMetadata | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/image/${id}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch image with ID ${id}:`, error);
    toast({
      title: "Error",
      description: "Failed to load image details. Please try again.",
      variant: "destructive",
    });
    return null;
  }
}

// PATCH /api/image/{id}
export async function updateImageMetadata(
  id: string,
  updates: { tags?: string; prompt?: string; favorite?: number }
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/image/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    toast({
      title: "Success",
      description: "Image metadata updated successfully",
    });
    
    return true;
  } catch (error) {
    console.error(`Failed to update image with ID ${id}:`, error);
    toast({
      title: "Error",
      description: "Failed to update image. Please try again.",
      variant: "destructive",
    });
    return false;
  }
}

// GET /api/tags
export async function getTags(): Promise<TagsMap> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tags`);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    toast({
      title: "Error",
      description: "Failed to load tags. Please try again.",
      variant: "destructive",
    });
    return {};
  }
}

// GET /api/stats
export async function getStats(): Promise<StatsData | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/stats`);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    toast({
      title: "Error",
      description: "Failed to load statistics. Please try again.",
      variant: "destructive",
    });
    return null;
  }
}

// Helper to get full URL for thumbnails
export function getThumbnailUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}
