import { ExternalBlob } from '../backend';
import type { Post } from '../backend';

// Maximum video upload size: 600MB in bytes
export const MAX_VIDEO_SIZE_BYTES = 600 * 1024 * 1024;

// Human-readable label for max video size
export const MAX_VIDEO_SIZE_LABEL = '600MB';

/**
 * Checks if a post has a valid video attachment
 */
export function hasValidVideo(post: Post): boolean {
  return !!post.video;
}

/**
 * Safely gets the direct URL for a video attachment
 */
export function getVideoURL(post: Post): string | null {
  if (!post.video) return null;
  try {
    return post.video.getDirectURL();
  } catch (error) {
    console.error('Failed to get video URL:', error);
    return null;
  }
}

/**
 * Checks if a post has a valid image attachment
 */
export function hasValidImage(post: Post): boolean {
  return !!post.image;
}

/**
 * Safely gets the direct URL for an image attachment
 */
export function getImageURL(post: Post): string | null {
  if (!post.image) return null;
  try {
    return post.image.getDirectURL();
  } catch (error) {
    console.error('Failed to get image URL:', error);
    return null;
  }
}

/**
 * Checks if a post has a valid document attachment
 */
export function hasValidDocument(post: Post): boolean {
  return !!post.document;
}

/**
 * Safely gets the direct URL for a document attachment
 */
export function getDocumentURL(post: Post): string | null {
  if (!post.document) return null;
  try {
    return post.document.getDirectURL();
  } catch (error) {
    console.error('Failed to get document URL:', error);
    return null;
  }
}

/**
 * Validates video file type
 */
export function isValidVideoType(file: File): boolean {
  const validTypes = [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-matroska',
  ];
  return validTypes.includes(file.type);
}

/**
 * Validates image file type
 */
export function isValidImageType(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(file.type);
}

/**
 * Gets a human-readable file size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
