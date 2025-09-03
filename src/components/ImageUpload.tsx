'use client';

import { useState, useRef } from 'react';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  buttonText?: string;
  className?: string;
  showPreview?: boolean;
}

export default function ImageUpload({ 
  onUpload, 
  buttonText = '画像をアップロード', 
  className = '',
  showPreview = true 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setUploadedUrl(result.url);
        onUpload(result.url);
        setError(null);
      } else {
        setError(result.error || 'アップロードに失敗しました');
      }
    } catch (err) {
      setError('アップロード中にエラーが発生しました');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setUploadedUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={uploading}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {uploading ? 'アップロード中...' : buttonText}
      </button>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 p-2 rounded border border-red-200">
          {error}
        </div>
      )}

      {showPreview && uploadedUrl && (
        <div className="relative">
          <img
            src={uploadedUrl}
            alt="アップロードされた画像"
            className="w-full h-32 object-cover rounded-lg border border-gray-300"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}