
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getTags, TagsMap } from "@/lib/api";
import { Search, X, Tag } from "lucide-react";

interface TagFilterProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

const TagFilter = ({ selectedTags, onTagsChange }: TagFilterProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTags, setFilteredTags] = useState<[string, number][]>([]);
  
  const { data: tagsMap, isLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: getTags,
  });

  useEffect(() => {
    if (!tagsMap) return;
    
    // Convert tags map to array and sort by count (descending)
    const tagsArray = Object.entries(tagsMap).sort((a, b) => b[1] - a[1]);
    
    // Filter tags based on search query
    if (searchQuery) {
      const filtered = tagsArray.filter(([tag]) => 
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTags(filtered);
    } else {
      setFilteredTags(tagsArray);
    }
  }, [tagsMap, searchQuery]);

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleClearSelection = () => {
    onTagsChange([]);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <h3 className="text-lg font-medium flex items-center">
          <Tag className="h-4 w-4 mr-2" /> Tags Filter
        </h3>
        {selectedTags.length > 0 && (
          <button
            onClick={handleClearSelection}
            className="ml-auto text-xs text-muted-foreground hover:text-foreground flex items-center"
          >
            <X className="h-3 w-3 mr-1" /> Clear
          </button>
        )}
      </div>
      
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tags..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-8"
        />
      </div>
      
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedTags.map((tag) => (
            <Badge 
              key={tag} 
              className="bg-primary"
              onClick={() => handleTagClick(tag)}
            >
              {tag} <X className="h-3 w-3 ml-1 cursor-pointer" />
            </Badge>
          ))}
        </div>
      )}
      
      <ScrollArea className="h-[calc(100vh-320px)] pr-4 rounded-md">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div 
                key={i} 
                className="h-8 rounded-md bg-muted/50 animate-pulse" 
              />
            ))}
          </div>
        ) : filteredTags.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {filteredTags.map(([tag, count]) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className={`justify-between cursor-pointer hover:bg-primary/90 ${
                  selectedTags.includes(tag) ? "bg-primary" : ""
                }`}
                onClick={() => handleTagClick(tag)}
              >
                <span className="truncate">{tag}</span>
                <span className="ml-1 text-xs bg-primary-foreground text-primary rounded-full px-1.5">
                  {count}
                </span>
              </Badge>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            {searchQuery ? "No matching tags found" : "No tags available"}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default TagFilter;
