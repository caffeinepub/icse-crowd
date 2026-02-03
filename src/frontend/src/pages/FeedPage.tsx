import { useState } from 'react';
import { useGetFeed, useCreatePost, useLikePost, useAddComment } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, MessageCircle, Image as ImageIcon, Send, Loader2, Video, FileText, X } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '../backend';
import { formatDistanceToNow } from 'date-fns';

export default function FeedPage() {
  const { data: posts, isLoading } = useGetFeed();
  const createPost = useCreatePost();
  const likePost = useLikePost();
  const addComment = useAddComment();
  const { identity } = useInternetIdentity();

  const [newPostContent, setNewPostContent] = useState('');
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
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});

  const currentUserPrincipal = identity?.getPrincipal().toString();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image must be less than 10MB');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        toast.error('Video must be less than 50MB');
        return;
      }
      setSelectedVideo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        toast.error('Document must be less than 20MB');
        return;
      }
      setSelectedDocument(file);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() && !selectedImage && !selectedVideo && !selectedDocument) {
      toast.error('Please add some content or attach a file');
      return;
    }

    try {
      let imageBlob: ExternalBlob | null = null;
      let videoBlob: ExternalBlob | null = null;
      let documentBlob: ExternalBlob | null = null;

      if (selectedImage) {
        const arrayBuffer = await selectedImage.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        imageBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress((prev) => ({ ...prev, image: percentage }));
        });
      }

      if (selectedVideo) {
        const arrayBuffer = await selectedVideo.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        videoBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress((prev) => ({ ...prev, video: percentage }));
        });
      }

      if (selectedDocument) {
        const arrayBuffer = await selectedDocument.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        documentBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress((prev) => ({ ...prev, document: percentage }));
        });
      }

      await createPost.mutateAsync({ 
        content: newPostContent, 
        image: imageBlob,
        video: videoBlob,
        document: documentBlob
      });
      
      setNewPostContent('');
      setSelectedImage(null);
      setSelectedVideo(null);
      setSelectedDocument(null);
      setImagePreview(null);
      setVideoPreview(null);
      setUploadProgress({ image: 0, video: 0, document: 0 });
      toast.success('Post created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create post');
    }
  };

  const handleLike = async (postId: bigint) => {
    try {
      await likePost.mutateAsync(postId);
    } catch (error: any) {
      toast.error(error.message || 'Failed to like post');
    }
  };

  const handleComment = async (postId: bigint) => {
    const content = commentInputs[postId.toString()];
    if (!content?.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      await addComment.mutateAsync({ postId, content });
      setCommentInputs({ ...commentInputs, [postId.toString()]: '' });
      toast.success('Comment added!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add comment');
    }
  };

  const sortedPosts = posts ? [...posts].sort((a, b) => Number(b.timestamp - a.timestamp)) : [];

  const isUploading = uploadProgress.image > 0 || uploadProgress.video > 0 || uploadProgress.document > 0;

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-2xl space-y-6">
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
                <img src={imagePreview} alt="Preview" className="max-h-64 rounded-lg object-cover" />
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
                <video src={videoPreview} controls className="max-h-64 w-full rounded-lg" />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={() => {
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
                      <span className="text-muted-foreground">Uploading image...</span>
                      <span className="font-medium">{uploadProgress.image}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div className="h-full bg-primary transition-all" style={{ width: `${uploadProgress.image}%` }} />
                    </div>
                  </div>
                )}
                {uploadProgress.video > 0 && uploadProgress.video < 100 && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Uploading video...</span>
                      <span className="font-medium">{uploadProgress.video}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div className="h-full bg-primary transition-all" style={{ width: `${uploadProgress.video}%` }} />
                    </div>
                  </div>
                )}
                {uploadProgress.document > 0 && uploadProgress.document < 100 && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Uploading document...</span>
                      <span className="font-medium">{uploadProgress.document}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div className="h-full bg-primary transition-all" style={{ width: `${uploadProgress.document}%` }} />
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
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="image-upload"
              />
              <Button variant="outline" size="sm" asChild>
                <label htmlFor="image-upload" className="cursor-pointer">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Image
                </label>
              </Button>

              <Input
                type="file"
                accept="video/*"
                onChange={handleVideoSelect}
                className="hidden"
                id="video-upload"
              />
              <Button variant="outline" size="sm" asChild>
                <label htmlFor="video-upload" className="cursor-pointer">
                  <Video className="mr-2 h-4 w-4" />
                  Video
                </label>
              </Button>

              <Input
                type="file"
                accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx"
                onChange={handleDocumentSelect}
                className="hidden"
                id="document-upload"
              />
              <Button variant="outline" size="sm" asChild>
                <label htmlFor="document-upload" className="cursor-pointer">
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
                'Post'
              )}
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-4">
          {sortedPosts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
              </CardContent>
            </Card>
          ) : (
            sortedPosts.map((post) => {
              const isLiked = post.likes.some((p) => p.toString() === currentUserPrincipal);
              const postIdStr = post.id.toString();

              return (
                <Card key={postIdStr}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{post.author.toString().slice(0, 10)}...</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(Number(post.timestamp) / 1000000), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {post.content && <p className="whitespace-pre-wrap">{post.content}</p>}
                    
                    {post.image && (
                      <img
                        src={post.image.getDirectURL()}
                        alt="Post"
                        className="max-h-96 w-full rounded-lg object-cover"
                      />
                    )}

                    {post.video && (
                      <video
                        src={post.video.getDirectURL()}
                        controls
                        className="max-h-96 w-full rounded-lg"
                      />
                    )}

                    {post.document && (
                      <a
                        href={post.document.getDirectURL()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent"
                      >
                        <FileText className="h-6 w-6 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="font-medium">Document Attachment</p>
                          <p className="text-sm text-muted-foreground">Click to view or download</p>
                        </div>
                      </a>
                    )}
                  </CardContent>
                  <CardFooter className="flex-col items-stretch gap-4">
                    <div className="flex gap-4">
                      <Button
                        variant={isLiked ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => handleLike(post.id)}
                        disabled={likePost.isPending}
                      >
                        <Heart className={`mr-2 h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                        {post.likes.length}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setShowComments({ ...showComments, [postIdStr]: !showComments[postIdStr] })
                        }
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Comment
                      </Button>
                    </div>

                    {showComments[postIdStr] && (
                      <div className="space-y-3 border-t pt-4">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Write a comment..."
                            value={commentInputs[postIdStr] || ''}
                            onChange={(e) =>
                              setCommentInputs({ ...commentInputs, [postIdStr]: e.target.value })
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleComment(post.id);
                              }
                            }}
                          />
                          <Button
                            size="icon"
                            onClick={() => handleComment(post.id)}
                            disabled={addComment.isPending}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardFooter>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
