import { c as createLucideIcon, m as useCreatePost, r as reactExports, j as jsxRuntimeExports, B as Button, L as LoaderCircle, a as ue, E as ExternalBlob } from "./index-DNXQSw_4.js";
import { C as Card, a as CardHeader, c as CardContent, e as CardFooter } from "./card-OOTnljHx.js";
import { I as Input } from "./input-Cb2tBxB6.js";
import { T as Textarea } from "./textarea-DASlJyYV.js";
import { n as normalizeICError } from "./icErrors-CWzto3lk.js";
import { X } from "./x-p_ZduJxi.js";
import { F as FileText } from "./file-text-TYf6-9fn.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }]
];
const Image = createLucideIcon("image", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",
      key: "ftymec"
    }
  ],
  ["rect", { x: "2", y: "6", width: "14", height: "12", rx: "2", key: "158x01" }]
];
const Video = createLucideIcon("video", __iconNode);
const MAX_VIDEO_SIZE_BYTES = 600 * 1024 * 1024;
const MAX_VIDEO_SIZE_LABEL = "600MB";
function hasValidVideo(post) {
  return !!post.video;
}
function getVideoURL(post) {
  if (!post.video) return null;
  try {
    return post.video.getDirectURL();
  } catch (error) {
    console.error("Failed to get video URL:", error);
    return null;
  }
}
function hasValidImage(post) {
  return !!post.image;
}
function getImageURL(post) {
  if (!post.image) return null;
  try {
    return post.image.getDirectURL();
  } catch (error) {
    console.error("Failed to get image URL:", error);
    return null;
  }
}
function hasValidDocument(post) {
  return !!post.document;
}
function getDocumentURL(post) {
  if (!post.document) return null;
  try {
    return post.document.getDirectURL();
  } catch (error) {
    console.error("Failed to get document URL:", error);
    return null;
  }
}
function isValidVideoType(file) {
  const validTypes = [
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-matroska"
  ];
  return validTypes.includes(file.type);
}
function isValidImageType(file) {
  const validTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp"
  ];
  return validTypes.includes(file.type);
}
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round(bytes / k ** i * 100) / 100} ${sizes[i]}`;
}
function PostComposer() {
  const createPost = useCreatePost();
  const [newPostContent, setNewPostContent] = reactExports.useState("");
  const [selectedImage, setSelectedImage] = reactExports.useState(null);
  const [selectedVideo, setSelectedVideo] = reactExports.useState(null);
  const [selectedDocument, setSelectedDocument] = reactExports.useState(null);
  const [imagePreview, setImagePreview] = reactExports.useState(null);
  const [videoPreview, setVideoPreview] = reactExports.useState(null);
  const [uploadProgress, setUploadProgress] = reactExports.useState({ image: 0, video: 0, document: 0 });
  reactExports.useEffect(() => {
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [videoPreview]);
  const handleImageSelect = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (file) {
      if (!isValidImageType(file)) {
        ue.error(
          "Please select a valid image file (JPEG, PNG, GIF, or WebP)"
        );
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        ue.error(
          `Image must be less than 10MB. Your file is ${formatFileSize(file.size)}`
        );
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.onerror = () => {
        ue.error("Failed to read image file. Please try again.");
      };
      reader.readAsDataURL(file);
    }
  };
  const handleVideoSelect = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (file) {
      if (!isValidVideoType(file)) {
        ue.error(
          "Please select a valid video file (MP4, WebM, OGG, MOV, AVI, or MKV)"
        );
        return;
      }
      if (file.size > MAX_VIDEO_SIZE_BYTES) {
        ue.error(
          `Video must be less than ${MAX_VIDEO_SIZE_LABEL}. Your file is ${formatFileSize(file.size)}`
        );
        return;
      }
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
      setSelectedVideo(file);
      const objectUrl = URL.createObjectURL(file);
      setVideoPreview(objectUrl);
    }
  };
  const handleDocumentSelect = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        ue.error(
          `Document must be less than 20MB. Your file is ${formatFileSize(file.size)}`
        );
        return;
      }
      setSelectedDocument(file);
    }
  };
  const handleCreatePost = async () => {
    if (!newPostContent.trim() && !selectedImage && !selectedVideo && !selectedDocument) {
      ue.error("Please add some content or attach a file");
      return;
    }
    try {
      let imageBlob = null;
      let videoBlob = null;
      let documentBlob = null;
      if (selectedImage) {
        try {
          const arrayBuffer = await selectedImage.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);
          imageBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress(
            (percentage) => {
              setUploadProgress((prev) => ({ ...prev, image: percentage }));
            }
          );
        } catch (_error) {
          throw new Error(
            "Failed to process image. Please try a different file."
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
            }
          );
        } catch (_error) {
          throw new Error(
            "Failed to process video. Please try a different file or reduce the file size."
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
            }
          );
        } catch (_error) {
          throw new Error(
            "Failed to process document. Please try a different file."
          );
        }
      }
      await createPost.mutateAsync({
        content: newPostContent,
        image: imageBlob,
        video: videoBlob,
        document: documentBlob
      });
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
      ue.success("Post created successfully!");
    } catch (error) {
      console.error("Post creation error:", error);
      const errorMessage = normalizeICError(error);
      ue.error(errorMessage);
    }
  };
  const isUploading = uploadProgress.image > 0 || uploadProgress.video > 0 || uploadProgress.document > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold", children: "Create a Post" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Textarea,
        {
          placeholder: "What's on your mind?",
          value: newPostContent,
          onChange: (e) => setNewPostContent(e.target.value),
          rows: 3
        }
      ),
      imagePreview && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: imagePreview,
            alt: "Preview",
            className: "max-h-64 rounded-lg object-cover"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "destructive",
            size: "icon",
            className: "absolute right-2 top-2",
            onClick: () => {
              setSelectedImage(null);
              setImagePreview(null);
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
          }
        )
      ] }),
      videoPreview && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "video",
          {
            src: videoPreview,
            controls: true,
            className: "max-h-64 w-full rounded-lg",
            preload: "metadata",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("track", { kind: "captions" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "destructive",
            size: "icon",
            className: "absolute right-2 top-2",
            onClick: () => {
              if (videoPreview) {
                URL.revokeObjectURL(videoPreview);
              }
              setSelectedVideo(null);
              setVideoPreview(null);
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
          }
        )
      ] }),
      selectedDocument && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg border p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-5 w-5 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: selectedDocument.name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            onClick: () => setSelectedDocument(null),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
          }
        )
      ] }),
      isUploading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        uploadProgress.image > 0 && uploadProgress.image < 100 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Uploading image..." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
              uploadProgress.image,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-full overflow-hidden rounded-full bg-secondary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full bg-primary transition-all",
              style: { width: `${uploadProgress.image}%` }
            }
          ) })
        ] }),
        uploadProgress.video > 0 && uploadProgress.video < 100 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Uploading video..." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
              uploadProgress.video,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-full overflow-hidden rounded-full bg-secondary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full bg-primary transition-all",
              style: { width: `${uploadProgress.video}%` }
            }
          ) })
        ] }),
        uploadProgress.document > 0 && uploadProgress.document < 100 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Uploading document..." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
              uploadProgress.document,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-full overflow-hidden rounded-full bg-secondary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full bg-primary transition-all",
              style: { width: `${uploadProgress.document}%` }
            }
          ) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardFooter, { className: "flex justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "file",
            accept: "image/jpeg,image/jpg,image/png,image/gif,image/webp",
            onChange: handleImageSelect,
            className: "hidden",
            id: "image-upload-composer"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "image-upload-composer", className: "cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "mr-2 h-4 w-4" }),
          "Image"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "file",
            accept: "video/mp4,video/webm,video/ogg,video/quicktime,video/x-msvideo,video/x-matroska",
            onChange: handleVideoSelect,
            className: "hidden",
            id: "video-upload-composer"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "video-upload-composer", className: "cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "mr-2 h-4 w-4" }),
          "Video"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "file",
            accept: ".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx",
            onChange: handleDocumentSelect,
            className: "hidden",
            id: "document-upload-composer"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "label",
          {
            htmlFor: "document-upload-composer",
            className: "cursor-pointer",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "mr-2 h-4 w-4" }),
              "Document"
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleCreatePost, disabled: createPost.isPending, children: createPost.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
        "Posting..."
      ] }) : "Post" })
    ] })
  ] });
}
export {
  PostComposer as P,
  hasValidVideo as a,
  getVideoURL as b,
  hasValidDocument as c,
  getDocumentURL as d,
  getImageURL as g,
  hasValidImage as h
};
