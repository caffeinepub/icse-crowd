import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Image as ImageIcon, Loader2, Video, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { useCreatePost } from "../hooks/useQueries";
import { normalizeICError } from "../utils/icErrors";
import {
  MAX_VIDEO_SIZE_BYTES,
  MAX_VIDEO_SIZE_LABEL,
  formatFileSize,
  isValidImageType,
  isValidVideoType,
} from "../utils/mediaGuards";

export default function PostComposer() {
  const createPost = useCreatePost();

  const [newPostContent, setNewPostContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{
    image: number;
    video: number;
    document: number;
  }>({ image: 0, video: 0, document: 0 });

  // Cleanup object URLs on unmount or when previews change
  useEffect(() => {
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [videoPreview]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!isValidImageType(file)) {
        toast.error(
          "Please select a valid image file (JPEG, PNG, GIF, or WebP)",
        );
        return;
      }

      // Validate file size
      if (file.size > 10 * 1024 * 1024) {
        toast.error(
          `Image must be less than 10MB. Your file is ${formatFileSize(file.size)}`,
        );
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.onerror = () => {
        toast.error("Failed to read image file. Please try again.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!isValidVideoType(file)) {
        toast.error(
          "Please select a valid video file (MP4, WebM, OGG, MOV, AVI, or MKV)",
        );
        return;
      }

      // Validate file size with 600MB limit
      if (file.size > MAX_VIDEO_SIZE_BYTES) {
        toast.error(
          `Video must be less than ${MAX_VIDEO_SIZE_LABEL}. Your file is ${formatFileSize(file.size)}`,
        );
        return;
      }

      // Revoke previous object URL if exists
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }

      setSelectedVideo(file);
      // Use object URL for video preview instead of data URL
      const objectUrl = URL.createObjectURL(file);
      setVideoPreview(objectUrl);
    }
  };

  const handleDocumentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        toast.error(
          `Document must be less than 20MB. Your file is ${formatFileSize(file.size)}`,
        );
        return;
      }
      setSelectedDocument(file);
    }
  };

  const handleCreatePost = async () => {
    if (
      !newPostContent.trim() &&
      !selectedImage &&
      !selectedVideo &&
      !selectedDocument
    ) {
      toast.error("Please add some content or attach a file");
      return;
    }

    try {
      let imageBlob: ExternalBlob | null = null;
      let videoBlob: ExternalBlob | null = null;
      let documentBlob: ExternalBlob | null = null;

      if (selectedImage) {
        try {
          const arrayBuffer = await selectedImage.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);
          imageBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress(
            (percentage) => {
              setUploadProgress((prev) => ({ ...prev, image: percentage }));
            },
          );
        } catch (_error) {
          throw new Error(
            "Failed to process image. Please try a different file.",
          );
        }
      }

      if (selectedVideo) {
        try {
          const arrayBuffer = await selectedVideo.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);
          videoBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress(
            (percentage) => {
              setUploadProgress((prev) => ({ ...prev, video: percentage }));
            },
          );
        } catch (_error) {
          throw new Error(
            "Failed to process video. Please try a different file or reduce the file size.",
          );
        }
      }

      if (selectedDocument) {
        try {
          const arrayBuffer = await selectedDocument.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);
          documentBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress(
            (percentage) => {
              setUploadProgress((prev) => ({ ...prev, document: percentage }));
            },
          );
        } catch (_error) {
          throw new Error(
            "Failed to process document. Please try a different file.",
          );
        }
      }

      await createPost.mutateAsync({
        content: newPostContent,
        image: imageBlob,
        video: videoBlob,
        document: documentBlob,
      });

      // Cleanup
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }

      setNewPostContent("");
      setSelectedImage(null);
      setSelectedVideo(null);
      setSelectedDocument(null);
      setImagePreview(null);
      setVideoPreview(null);
      setUploadProgress({ image: 0, video: 0, document: 0 });
      toast.success("Post created successfully!");
    } catch (error: any) {
      console.error("Post creation error:", error);
      const errorMessage = normalizeICError(error);
      toast.error(errorMessage);
    }
  };

  const isUploading =
    uploadProgress.image > 0 ||
    uploadProgress.video > 0 ||
    uploadProgress.document > 0;

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Create a Post</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="What's on your mind?"
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          rows={3}
        />

        {imagePreview && (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-h-64 rounded-lg object-cover"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => {
                setSelectedImage(null);
                setImagePreview(null);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {videoPreview && (
          <div className="relative">
            <video
              src={videoPreview}
              controls
              className="max-h-64 w-full rounded-lg"
              preload="metadata"
            >
              <track kind="captions" />
            </video>
            <Button
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => {
                if (videoPreview) {
                  URL.revokeObjectURL(videoPreview);
                }
                setSelectedVideo(null);
                setVideoPreview(null);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {selectedDocument && (
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">{selectedDocument.name}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedDocument(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {isUploading && (
          <div className="space-y-3">
            {uploadProgress.image > 0 && uploadProgress.image < 100 && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Uploading image...
                  </span>
                  <span className="font-medium">{uploadProgress.image}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${uploadProgress.image}%` }}
                  />
                </div>
              </div>
            )}
            {uploadProgress.video > 0 && uploadProgress.video < 100 && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Uploading video...
                  </span>
                  <span className="font-medium">{uploadProgress.video}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${uploadProgress.video}%` }}
                  />
                </div>
              </div>
            )}
            {uploadProgress.document > 0 && uploadProgress.document < 100 && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Uploading document...
                  </span>
                  <span className="font-medium">
                    {uploadProgress.document}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${uploadProgress.document}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleImageSelect}
            className="hidden"
            id="image-upload-composer"
          />
          <Button variant="outline" size="sm" asChild>
            <label htmlFor="image-upload-composer" className="cursor-pointer">
              <ImageIcon className="mr-2 h-4 w-4" />
              Image
            </label>
          </Button>

          <Input
            type="file"
            accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-msvideo,video/x-matroska"
            onChange={handleVideoSelect}
            className="hidden"
            id="video-upload-composer"
          />
          <Button variant="outline" size="sm" asChild>
            <label htmlFor="video-upload-composer" className="cursor-pointer">
              <Video className="mr-2 h-4 w-4" />
              Video
            </label>
          </Button>

          <Input
            type="file"
            accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx"
            onChange={handleDocumentSelect}
            className="hidden"
            id="document-upload-composer"
          />
          <Button variant="outline" size="sm" asChild>
            <label
              htmlFor="document-upload-composer"
              className="cursor-pointer"
            >
              <FileText className="mr-2 h-4 w-4" />
              Document
            </label>
          </Button>
        </div>
        <Button onClick={handleCreatePost} disabled={createPost.isPending}>
          {createPost.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Posting...
            </>
          ) : (
            "Post"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
