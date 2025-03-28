
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import AppLayout from "@/components/layout/AppLayout";
import ImageGrid from "@/components/images/ImageGrid";
import ImageDetailModal from "@/components/images/ImageDetailModal";
import StatsPanel from "@/components/dashboard/StatsPanel";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

const Index = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [thumbnailSize, setThumbnailSize] = useState<"small" | "medium" | "large">("medium");
  const [showFilters, setShowFilters] = useState(true);
  const [showDashboard, setShowDashboard] = useState(true);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleTagsChange = (tags: string[]) => {
    setSelectedTags(tags);
  };

  const toggleFavorites = () => {
    setShowFavorites(!showFavorites);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const toggleDashboard = () => {
    setShowDashboard(!showDashboard);
  };

  const handleImageClick = (id: string) => {
    setSelectedImageId(id);
    setModalOpen(true);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["images"] });
    queryClient.invalidateQueries({ queryKey: ["tags"] });
    queryClient.invalidateQueries({ queryKey: ["stats"] });
  };

  return (
    <AppLayout
      selectedTags={selectedTags}
      onTagsChange={handleTagsChange}
      showFavorites={showFavorites}
      toggleFavorites={toggleFavorites}
      thumbnailSize={thumbnailSize}
      setThumbnailSize={setThumbnailSize}
      showFilters={showFilters}
      toggleFilters={toggleFilters}
      showDashboard={showDashboard}
      toggleDashboard={toggleDashboard}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">
          {showFavorites ? "Favorite Images" : "All Images"}
          {selectedTags.length > 0 && (
            <span className="text-lg font-normal ml-2 text-muted-foreground">
              • Filtered by {selectedTags.length} tag{selectedTags.length !== 1 ? "s" : ""}
            </span>
          )}
        </h2>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {showDashboard && <StatsPanel />}
      
      <ImageGrid
        selectedTags={selectedTags}
        showFavorites={showFavorites}
        onImageClick={handleImageClick}
        thumbnailSize={thumbnailSize}
      />
      
      <ImageDetailModal
        imageId={selectedImageId}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </AppLayout>
  );
};

export default Index;
