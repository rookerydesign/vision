
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { getImageById, updateImageMetadata, getThumbnailUrl, ImageMetadata } from "@/lib/api";
import { Star, StarOff, Save, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ImageDetailModalProps {
  imageId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ImageDetailModal = ({ imageId, open, onOpenChange }: ImageDetailModalProps) => {
  const [image, setImage] = useState<ImageMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editableTags, setEditableTags] = useState("");
  const [editablePrompt, setEditablePrompt] = useState("");
  const [favorite, setFavorite] = useState(0);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchImageDetails = async () => {
      if (!imageId || !open) return;
      
      setLoading(true);
      try {
        const imageData = await getImageById(imageId);
        if (imageData) {
          setImage(imageData);
          setEditableTags(imageData.tags);
          setEditablePrompt(imageData.prompt);
          setFavorite(imageData.favorite);
        }
      } catch (error) {
        console.error("Error fetching image details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImageDetails();
  }, [imageId, open]);

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditableTags(e.target.value);
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditablePrompt(e.target.value);
  };

  const toggleFavorite = () => {
    setFavorite(favorite === 1 ? 0 : 1);
  };

  const handleSave = async () => {
    if (!imageId || !image) return;
    
    setSaving(true);
    try {
      const success = await updateImageMetadata(imageId, {
        tags: editableTags,
        prompt: editablePrompt,
        favorite: favorite,
      });
      
      if (success) {
        // Update local state to reflect changes
        setImage({
          ...image,
          tags: editableTags,
          prompt: editablePrompt,
          favorite: favorite,
        });
        
        // Invalidate queries to refetch data
        queryClient.invalidateQueries({ queryKey: ["images"] });
        queryClient.invalidateQueries({ queryKey: ["tags"] });
        queryClient.invalidateQueries({ queryKey: ["stats"] });
      }
    } catch (error) {
      console.error("Error saving image details:", error);
    } finally {
      setSaving(false);
    }
  };

  if (!image && !loading) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading image details...</p>
          </div>
        ) : image ? (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl">Image Details</DialogTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleFavorite}
                  className="focus:ring-0"
                >
                  {favorite === 1 ? (
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ) : (
                    <StarOff className="h-5 w-5 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </DialogHeader>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-md overflow-hidden bg-black flex items-center justify-center h-[500px]">
                <img 
                  src={getThumbnailUrl(image.thumbnails.large)} 
                  alt={image.prompt.substring(0, 50)}
                  className="max-h-full max-w-full object-contain" 
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Image ID</label>
                  <div className="text-sm text-muted-foreground bg-muted p-2 rounded-md">{image.id}</div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Created At</label>
                  <div className="text-sm text-muted-foreground">
                    {new Date(image.created_at).toLocaleString()}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Prompt</label>
                  <Textarea 
                    value={editablePrompt} 
                    onChange={handlePromptChange}
                    className="min-h-[100px] resize-none"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Tags</label>
                  <Input value={editableTags} onChange={handleTagsChange} />
                  <div className="flex flex-wrap gap-1 mt-2">
                    {editableTags.split(",").map((tag, index) => {
                      const trimmedTag = tag.trim();
                      if (!trimmedTag) return null;
                      return <Badge key={index} className="bg-primary">{trimmedTag}</Badge>;
                    })}
                  </div>
                </div>
                
                {image.loras && (
                  <div>
                    <label className="text-sm font-medium mb-1 block">LORAs</label>
                    <div className="text-sm text-muted-foreground bg-muted p-2 rounded-md">
                      {image.loras}
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Generation Settings</label>
                  <div className="text-sm text-muted-foreground bg-muted p-2 rounded-md">
                    {image.gen_settings || "No generation settings available"}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Size</label>
                  <div className="text-sm">{image.image_size}</div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="gap-2"
              >
                <X className="h-4 w-4" /> Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="text-center p-4">
            <p>Image not found or could not be loaded.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImageDetailModal;
