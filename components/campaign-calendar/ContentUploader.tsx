'use client';

import React, { useState, useCallback } from 'react';
import { Upload, Image as ImageIcon, Video, FileText, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface MediaFile {
  id: string;
  file: File;
  type: 'image' | 'video';
  url: string;
  platforms: PlatformFormat[];
}

interface PlatformFormat {
  platform: string;
  dimensions: { width: number; height: number };
  duration?: number;
  formatted?: boolean;
}

interface ContentUploaderProps {
  onMediaUpload: (media: MediaFile[]) => void;
  selectedPlatforms: string[];
}

const PLATFORM_SPECS = {
  instagram: {
    story: { width: 1080, height: 1920 },
    post: { width: 1080, height: 1080 },
    reel: { width: 1080, height: 1920, duration: 90 }
  },
  tiktok: {
    video: { width: 1080, height: 1920, duration: 180 }
  },
  facebook: {
    post: { width: 1200, height: 630 },
    story: { width: 1080, height: 1920 }
  },
  youtube: {
    short: { width: 1080, height: 1920, duration: 60 },
    video: { width: 1920, height: 1080 }
  },
  linkedin: {
    post: { width: 1200, height: 627 }
  }
};

export const ContentUploader: React.FC<ContentUploaderProps> = ({
  onMediaUpload,
  selectedPlatforms
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<MediaFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsProcessing(true);
    
    const mediaFiles: MediaFile[] = acceptedFiles.map(file => {
      const type = file.type.startsWith('image/') ? 'image' : 'video';
      const platforms = generatePlatformFormats(selectedPlatforms, type);
      
      return {
        id: Date.now().toString() + Math.random(),
        file,
        type,
        url: URL.createObjectURL(file),
        platforms
      };
    });

    setUploadedFiles(prev => [...prev, ...mediaFiles]);
    onMediaUpload(mediaFiles);
    setIsProcessing(false);
  }, [selectedPlatforms, onMediaUpload]);

  const generatePlatformFormats = (platforms: string[], mediaType: 'image' | 'video'): PlatformFormat[] => {
    const formats: PlatformFormat[] = [];
    
    platforms.forEach(platform => {
      const specs = PLATFORM_SPECS[platform as keyof typeof PLATFORM_SPECS];
      if (specs) {
        Object.entries(specs).forEach(([format, dimensions]) => {
          const hasDuration = (dimensions as any).duration as number | undefined;
          if (
            (mediaType === 'image' && !hasDuration) ||
            (mediaType === 'video' && !!hasDuration)
          ) {
            formats.push({
              platform: `${platform}-${format}`,
              dimensions: { width: (dimensions as any).width, height: (dimensions as any).height },
              duration: hasDuration
            });
          }
        });
      }
    });
    
    return formats;
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'video/*': ['.mp4', '.mov', '.avi', '.webm']
    },
    multiple: true
  });

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        {isDragActive ? (
          <p className="text-blue-600">Drop your files here...</p>
        ) : (
          <div>
            <p className="text-lg font-medium text-gray-700 mb-2">
              Upload your content
            </p>
            <p className="text-sm text-gray-500">
              Drag & drop images or videos, or click to select files
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Supports PNG, JPG, GIF, MP4, MOV (max 100MB)
            </p>
          </div>
        )}
      </div>

      {isProcessing && (
        <div className="text-center py-4">
          <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-sm text-gray-600 mt-2">Processing files...</p>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium text-gray-800">Uploaded Content</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedFiles.map((media) => (
              <div key={media.id} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  {media.type === 'image' ? (
                    <img
                      src={media.url}
                      alt="Uploaded content"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={media.url}
                      className="w-full h-full object-cover"
                      muted
                    />
                  )}
                </div>
                
                <button
                  onClick={() => removeFile(media.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>

                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    {media.type === 'image' ? <ImageIcon size={12} /> : <Video size={12} />}
                    <span className="truncate">{media.file.name}</span>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    {media.platforms.length} format{media.platforms.length !== 1 ? 's' : ''}
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {media.platforms.slice(0, 2).map((platform, idx) => (
                      <span
                        key={idx}
                        className="px-1 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                      >
                        {platform.platform}
                      </span>
                    ))}
                    {media.platforms.length > 2 && (
                      <span className="px-1 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                        +{media.platforms.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
