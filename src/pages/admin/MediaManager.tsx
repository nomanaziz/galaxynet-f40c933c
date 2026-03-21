import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2, Copy, Image } from "lucide-react";

const MediaManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const { data: files = [], isLoading } = useQuery({
    queryKey: ["media_files"],
    queryFn: async () => {
      const { data, error } = await supabase.storage.from("media").list("", { limit: 100, sortBy: { column: "created_at", order: "desc" } });
      if (error) throw error;
      return data || [];
    },
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(path, file);
    setUploading(false);
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } else {
      queryClient.invalidateQueries({ queryKey: ["media_files"] });
      toast({ title: "Uploaded!" });
    }
    e.target.value = "";
  };

  const handleDelete = async (name: string) => {
    const { error } = await supabase.storage.from("media").remove([name]);
    if (error) {
      toast({ title: "Delete failed", variant: "destructive" });
    } else {
      queryClient.invalidateQueries({ queryKey: ["media_files"] });
      toast({ title: "Deleted!" });
    }
  };

  const getUrl = (name: string) => {
    const { data } = supabase.storage.from("media").getPublicUrl(name);
    return data.publicUrl;
  };

  const copyUrl = (name: string) => {
    navigator.clipboard.writeText(getUrl(name));
    toast({ title: "URL copied!" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Media Manager</h1>
        <div>
          <Input type="file" accept="image/*" onChange={handleUpload} className="hidden" id="media-upload" />
          <Button asChild disabled={uploading}>
            <label htmlFor="media-upload" className="cursor-pointer">
              <Upload className="mr-2 h-4 w-4" /> {uploading ? "Uploading..." : "Upload"}
            </label>
          </Button>
        </div>
      </div>

      {files.length === 0 && !isLoading && (
        <div className="text-center py-16">
          <Image className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No media files yet. Upload your first image!</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {files.map((file) => (
          <Card key={file.name} className="overflow-hidden">
            <div className="aspect-square bg-muted flex items-center justify-center">
              <img src={getUrl(file.name)} alt={file.name} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground truncate mb-2">{file.name}</p>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => copyUrl(file.name)}>
                  <Copy className="h-3 w-3 mr-1" /> URL
                </Button>
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(file.name)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MediaManager;
