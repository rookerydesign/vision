
import { useQuery } from "@tanstack/react-query";
import { getStats } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ImageIcon, TagIcon, StarIcon } from "lucide-react";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const StatsPanel = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-32">
            <CardContent className="bg-muted/20 h-full rounded-md" />
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  // Prepare data for bar chart
  const chartData = stats.top_tags.map(([tag, count]) => ({
    name: tag,
    value: count
  }));

  const taggedPercentage = (stats.tagged_images / stats.total_images) * 100;

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Images</CardTitle>
          <ImageIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_images}</div>
          {/* Note: compressed is not in the StatsData type, so we're removing it */}
          <p className="text-xs text-muted-foreground">
            Library Statistics
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tagged Images</CardTitle>
          <TagIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.tagged_images} <span className="text-sm text-muted-foreground">of {stats.total_images}</span>
          </div>
          <div className="mt-2">
            <Progress value={taggedPercentage} className="h-2" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {stats.untagged_images} untagged images
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Tags</CardTitle>
          <StarIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="h-[150px]">
          <ChartContainer 
            className="h-full w-full"
            config={{
              tag: {
                theme: {
                  light: "hsl(var(--primary))",
                  dark: "hsl(var(--primary))"
                }
              }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="name" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Bar 
                  dataKey="value" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                  className="fill-primary"
                />
                <ChartTooltip 
                  content={
                    <ChartTooltipContent 
                      labelFormatter={(label) => `Tag: ${label}`} 
                    />
                  }
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsPanel;
