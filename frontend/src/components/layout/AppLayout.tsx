
import { useState } from "react";
import { SidebarProvider, Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  LayoutGrid, 
  Star, 
  ImageIcon, 
  Menu, 
  X, 
  SlidersHorizontal, 
  GalleryHorizontalEnd 
} from "lucide-react";
import TagFilter from "@/components/filters/TagFilter";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface AppLayoutProps {
  children: React.ReactNode;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  showFavorites: boolean;
  toggleFavorites: () => void;
  thumbnailSize: "small" | "medium" | "large";
  setThumbnailSize: (size: "small" | "medium" | "large") => void;
  showFilters: boolean;
  toggleFilters: () => void;
  showDashboard: boolean;
  toggleDashboard: () => void;
}

const AppLayout = ({
  children,
  selectedTags,
  onTagsChange,
  showFavorites,
  toggleFavorites,
  thumbnailSize,
  setThumbnailSize,
  showFilters,
  toggleFilters,
  showDashboard,
  toggleDashboard,
}: AppLayoutProps) => {
  const [showSidebar, setShowSidebar] = useState(true);

  const handleToggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className={showSidebar ? "" : "w-0 md:w-auto"}>
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-bold flex items-center">
              <ImageIcon className="mr-2 h-5 w-5" />
              <span className="hidden md:inline">Visionary Vault</span>
            </h1>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleToggleSidebar}
              className="md:hidden"
            >
              {showSidebar ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
          
          <SidebarContent className="px-4 py-2">
            <div className="space-y-1">
              <Button
                variant={showDashboard ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={toggleDashboard}
              >
                <GalleryHorizontalEnd className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              
              <Button
                variant={showFavorites ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={toggleFavorites}
              >
                <Star className={`mr-2 h-4 w-4 ${showFavorites ? "fill-primary-foreground" : ""}`} />
                Favorites
              </Button>
              
              <Button
                variant={showFilters ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={toggleFilters}
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Thumbnail Size</h3>
              </div>
              
              <ToggleGroup 
                type="single" 
                value={thumbnailSize}
                onValueChange={(value) => {
                  if (value) setThumbnailSize(value as "small" | "medium" | "large");
                }}
                className="justify-between"
              >
                <ToggleGroupItem value="small" aria-label="Small thumbnails">
                  <LayoutGrid className="h-4 w-4" />
                  <span className="ml-2 text-xs">S</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="medium" aria-label="Medium thumbnails">
                  <LayoutGrid className="h-5 w-5" />
                  <span className="ml-2 text-xs">M</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="large" aria-label="Large thumbnails">
                  <LayoutGrid className="h-6 w-6" />
                  <span className="ml-2 text-xs">L</span>
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            
            <Separator className="my-4" />
            
            {showFilters && (
              <TagFilter 
                selectedTags={selectedTags} 
                onTagsChange={onTagsChange}
              />
            )}
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 overflow-auto">
          <div className="container py-4">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
