'use client';

import { useState } from 'react';
import { Upload, X, Image } from 'lucide-react';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
  onImageRemoved?: () => void;
}

export default function ImageUpload({ onImageUploaded, currentImage, onImageRemoved }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        onImageUploaded(data.url);
      } else {
        const errorData = await response.json();
        alert(`エラー: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('ファイルのアップロードに失敗しました');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    const files = event.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-bold mb-2 press-start-2p-regular">
        記事画像
      </label>

      {currentImage ? (
        <div className="relative">
          <img
            src={currentImage}
            alt="記事画像"
            className="w-full h-48 object-cover rounded-lg border border-gray-300"
          />
          {onImageRemoved && (
            <button
              type="button"
              onClick={onImageRemoved}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              title="画像を削除"
            >
              <X size={16} />
            </button>
          )}
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver
              ? 'border-black bg-gray-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="imageUpload"
            disabled={uploading}
          />
          
          <div className="flex flex-col items-center space-y-2">
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                <p className="text-sm text-gray-500 press-start-2p-regular">アップロード中...</p>
              </>
            ) : (
              <>
                <Upload size={32} className="text-gray-400" />
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 press-start-2p-regular">
                    クリックまたはドラッグ&ドロップで画像をアップロード
                  </p>
                  <p className="text-xs text-gray-500">
                    対応形式: JPG, PNG, GIF, WebP (最大5MB)
                  </p>
                </div>
                <label
                  htmlFor="imageUpload"
                  className="cursor-pointer bg-gray-100 hover:bg-gray-200 rounded transition-colors press-start-2p-button text-sm"
                >
                  ファイルを選択
                </label>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}